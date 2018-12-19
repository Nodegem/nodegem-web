type MenuContents = {
    items: Array<MenuItem | SubMenu>;
};

type MenuItem = {
    label: string;
    action: () => void;
};

type SubMenu = {
    label: string;
    subMenu?: SubMenu;
    items?: Array<MenuItem>;
};

type MenuOptions = {
    x: number;
    y: number;
    meta?: {
        className: string;
        id: string;
    };
};

let menuId = 1;

class ContextMenu {

    private parentElement: HTMLElement;
    private element: HTMLElement;
    private contextId: number = menuId;

    constructor(parentElement?: HTMLElement) {
        this.element = document.createElement("div");
        this.element.className = `testicles`;
        this.element.id = `menu-${this.contextId}`;
        this.element.style.display = "none";
        this.element.style.position = "fixed";

        if(!parentElement) {
            this.parentElement = document.getElementsByTagName("BODY")[0] as HTMLElement;
        }

        this.parentElement.appendChild(this.element);
        menuId++;
    }

    show(items: MenuContents, opts: MenuOptions) {
        this.element.style.display = "block";
    }

    hide() {
        this.element.style.display = "none";
    }
}

const contextMenu = new ContextMenu();

export {
    ContextMenu,
    contextMenu
}
