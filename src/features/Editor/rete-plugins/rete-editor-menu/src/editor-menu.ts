import classNames from 'classnames';
import Fuse from 'fuse.js';
import './editor-menu.less';
import { isDescendant } from 'src/utils';

export type MenuContents = {
    filterableItems?: Array<MenuItem | SubMenu>;
    otherItems?: Array<MenuItem | SubMenu | DividerItem>;
};

export type DividerItem = {
    label?: string;
};

export type MenuItem = {
    label: string;
    data: any;
    disabled?: boolean;
    action: () => void;
};

export type SubMenu = {
    label: string;
    disabled?: boolean;
    items: Array<MenuItem | SubMenu | DividerItem>;
};

export type MenuOptions = {
    x: number;
    y: number;
    hideOnMouseLeave?: {
        timeout: number;
    };
    maxDisplayItems?: number;
};

type PathData = {
    path: string;
    data: Array<MenuItem | SubMenu | DividerItem>;
};

function isSubMenu(arg: any): arg is SubMenu {
    return arg.items !== undefined;
}

function isMenuItem(arg: any): arg is MenuItem {
    return arg.action !== undefined;
}

const cssClasses = {
    menu: 'editor-menu',
    menuVisible: 'editor-menu--visible',
    menuItem: 'editor-menu-menuitem',
    menuItemSelected: 'editor-menu-menuitem--selected',
    menuItemDivider: 'editor-menu-menuitem--divider',
    menuItemDisabled: 'editor-menu-menuitem--disabled',
    subMenu: 'editor-menu-submenu',
    menuInput: 'editor-menu-input',
    goBack: 'editor-menu-goback',
};

class EditorMenu {
    private containerElement: HTMLDivElement;
    private listElement: HTMLUListElement;
    private visible: boolean = false;
    private inputElement: HTMLInputElement;
    private fuzzySearch: Fuse<MenuItem>;

    private currentPath: Array<PathData> = [];
    private allMenuItems: Array<MenuItem> = [];

    private currentSelection: number = 0;

    get isVisible() {
        return this.visible;
    }

    constructor() {
        const containerElement = document.createElement('div');
        containerElement.className = cssClasses.menu;
        containerElement.style.position = 'fixed';

        const inputElement = document.createElement('input');
        inputElement.className = cssClasses.menuInput;
        inputElement.placeholder = 'Filter...';
        inputElement.oninput = this.handleFilterChange;
        this.inputElement = inputElement;

        this.listElement = document.createElement('ul');
        containerElement.appendChild(inputElement);
        containerElement.appendChild(this.listElement);

        const body = document.getElementsByTagName('BODY')[0];
        body.appendChild(containerElement);

        this.containerElement = containerElement;
    }

    private handleFilterChange = async (ev: Event) => {
        const currentTarget = <HTMLInputElement>ev.target;
        const { value } = currentTarget;

        this.clear();

        if (!value) {
            this.currentPath = this.currentPath.slice(0, 1);
            this.renderItems(this.currentPath[0].data);
        }

        const result = await Promise.resolve(this.fuzzySearch.search(value));
        this.renderItems(result.slice(0, 10), true);
    };

    public show(contents: MenuContents, opts: MenuOptions) {
        if (
            (contents.filterableItems &&
                contents.filterableItems.length <= 0) ||
            (contents.otherItems && contents.otherItems.length <= 0)
        ) {
            return;
        }

        if (!contents.filterableItems) {
            this.inputElement.style.display = 'none';
        } else {
            this.inputElement.style.display = 'block';
        }

        if (this.isVisible) {
            this.hide();
        }

        this.allMenuItems = this.getAllFilterableMenuItems(contents);
        this.registerEventListeners();

        this.currentPath.push({
            path: 'root',
            data: [
                ...(contents.filterableItems || []),
                ...((contents.otherItems &&
                    contents.filterableItems && [{}, ...contents.otherItems]) ||
                    contents.otherItems ||
                    []),
            ],
        });
        this.fuzzySearch = new Fuse(this.allMenuItems, {
            keys: [
                {
                    name: 'label',
                    weight: 0.65,
                },
                {
                    name: 'data.fullName',
                    weight: 0.35,
                },
            ] as any,
            shouldSort: true,
        });

        const { x, y, hideOnMouseLeave } = opts;

        if (hideOnMouseLeave) {
            this.containerElement.dispatchEvent(new MouseEvent('mouseenter'));
            this.containerElement.addEventListener('mouseleave', e => {
                setTimeout(() => {
                    this.hide();
                }, hideOnMouseLeave.timeout);
            });
        }

        this.renderItems(this.currentPath[0].data);

        const { innerWidth, innerHeight } = window;
        const { width, height } = this.containerElement.getBoundingClientRect();
        let xOffset = x + 1;
        let yOffset = y + 1;

        const xBounds = xOffset + width;
        const yBounds = yOffset + height;

        if (xBounds >= innerWidth) {
            xOffset = xOffset - width;
        }

        if (yBounds >= innerHeight) {
            yOffset = yOffset - height;
        }

        this.containerElement.style.left = `${xOffset}px`;
        this.containerElement.style.top = `${yOffset}px`;

        this.visible = true;
        this.containerElement.className = classNames(
            cssClasses.menu,
            cssClasses.menuVisible
        );
    }

    public hide = () => {
        this.allMenuItems = [];
        this.unRegisterEventListeners();
        this.visible = false;
        this.inputElement.value = '';
        this.containerElement.className = cssClasses.menu;
        this.currentPath = [];
        this.clear();
    };

    private createSubMenu(item: SubMenu) {
        const li = document.createElement('li');
        const ul = document.createElement('ul');
        li.appendChild(ul);
        li.onclick = e => this.handleSubMenuClick(e, item);
        li.className = classNames(cssClasses.menuItem, cssClasses.subMenu);
        li.innerHTML = item.label;

        this.listElement.appendChild(li);
    }

    private getAllFilterableMenuItems(content: MenuContents): Array<MenuItem> {
        let menuItems: Array<MenuItem> = [];

        if (!content.filterableItems) return menuItems;

        content.filterableItems.forEach(i => {
            if (isMenuItem(i)) {
                menuItems.push(i);
            } else if (isSubMenu(i)) {
                menuItems.push(...this.getAllMenuItemsFromSubMenu(i));
            }
        });

        return menuItems;
    }

    private getAllMenuItemsFromSubMenu(subMenu: SubMenu): Array<MenuItem> {
        let menuItems: Array<MenuItem> = [];

        subMenu.items.forEach(i => {
            if (isMenuItem(i)) {
                menuItems.push(i);
            } else if (isSubMenu(i)) {
                menuItems.push(...this.getAllMenuItemsFromSubMenu(i));
            }
        });

        return menuItems;
    }

    private renderItems(
        items: Array<SubMenu | MenuItem | DividerItem>,
        filtering: boolean = false
    ) {
        items.forEach(i => {
            if (isSubMenu(i)) {
                this.createSubMenu(i);
            } else {
                this.createItem(i);
            }
        });

        if (!filtering && this.currentPath.length > 1) {
            this.createItem({} as DividerItem);
            const goBack = document.createElement('li');
            goBack.className = classNames(
                cssClasses.menuItem,
                cssClasses.goBack
            );
            goBack.innerHTML = 'Back';
            goBack.onclick = () => {
                this.currentPath = this.currentPath.slice(0, -1);
                this.clear();
                this.renderItems(
                    this.currentPath[this.currentPath.length - 1].data
                );
            };
            this.listElement.appendChild(goBack);
        }
    }

    private clear() {
        while (this.listElement.firstChild) {
            this.listElement.removeChild(this.listElement.firstChild);
        }
    }

    private keyboardNavigation = (ev: KeyboardEvent) => {
        console.log(ev.keyCode);
        switch (ev.keyCode) {
            case 13: //SPACE
                break;

            case 27: //ESC
                this.hide();
                break;

            case 38: //UP
                break;

            case 40: //DOWN
                break;
        }
    };

    private registerEventListeners() {
        document.addEventListener('keydown', this.keyboardNavigation, true);
        document.addEventListener('mousedown', this.handleOutsideClick, true);
        document.addEventListener('touchstart', this.handleOutsideClick, true);
        document.addEventListener('contextmenu', this.hide);
    }

    private unRegisterEventListeners() {
        document.removeEventListener('keydown', this.keyboardNavigation);
        document.removeEventListener('mousedown', this.handleOutsideClick);
        document.removeEventListener('touchstart', this.handleOutsideClick);
        document.removeEventListener('contextmenu', this.hide);
    }

    private handleOutsideClick = (e: MouseEvent) => {
        if (
            !this.isDescendant(e.target) &&
            e.target !== this.containerElement
        ) {
            this.hide();
        }
    };

    private isDescendant(child) {
        return isDescendant(this.containerElement, child);
    }

    private createItem(item: MenuItem | DividerItem) {
        if (isMenuItem(item)) {
            const li = document.createElement('li');
            li.className = classNames(cssClasses.menuItem, {
                [cssClasses.menuItemDisabled]: item.disabled,
            });
            li.onclick = e => this.handleItemClick(e, item);
            li.innerHTML = item.label;
            this.listElement.appendChild(li);
        } else {
            const divider = document.createElement('div');
            divider.className = cssClasses.menuItemDivider;
            this.listElement.appendChild(divider);
        }
    }

    private handleSubMenuClick = (e: MouseEvent, subMenu: SubMenu) => {
        this.currentPath.push({ path: subMenu.label, data: subMenu.items });
        this.clear();
        this.renderItems(subMenu.items);
    };

    private handleItemClick = (e: MouseEvent, item: MenuItem) => {
        if (!item.disabled) item.action();
        this.hide();
    };
}

export default new EditorMenu();
