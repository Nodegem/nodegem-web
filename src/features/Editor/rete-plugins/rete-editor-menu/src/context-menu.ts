type MenuContents = Array<MenuItem | SubMenu | DividerItem>;

type DividerItem = {
  label: string;
}

type MenuItem = {
  label: string;
  disabled?: boolean;
  action: () => void;
};

type SubMenu = {
  label: string;
  disabled?: boolean;
  items: Array<MenuItem | SubMenu | DividerItem>;
};

type MenuOptions = {
  x: number;
  y: number;
  meta?: {
    className: string;
    id: string;
  };
};

function isSubMenu(arg: any): arg is SubMenu {
  return arg.items !== undefined;
}

let menuId = 1;

class ContextMenu {
  private element: HTMLElement;
  private contextId: number;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = `context-menu`;

    this.contextId = menuId++;
    this.element.id = `menu-${this.contextId}`;
    this.element.style.display = "none";
    this.element.style.position = "absolute";

    const ul = document.createElement('ul');
    this.element.appendChild(ul);

    const body = document.getElementsByTagName("BODY")[0];
    body.appendChild(this.element);
  }

  show(contents: MenuContents, opts: MenuOptions) {
    if (contents.length <= 0) return;

    this.element.style.display = "block";
    contents.forEach(x => {
      if (isSubMenu(x)) {
        this.createSubMenu(x);
      } else {
        this.createItem(x);
      }
    });
  }

  hide() {
    this.element.style.display = "none";
  }

  private createSubMenu(item: SubMenu) {
    const li = document.createElement('li');
  }

  private createItem(item: MenuItem | DividerItem) {
    const li = document.createElement('li');
  }
}

const contextMenu = new ContextMenu();

export { contextMenu, ContextMenu };
