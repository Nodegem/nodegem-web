import * as d3 from "d3";

class ContextMenu {

    private hideDelay: number = 250;
    private isVisible: boolean = false;
    private menuElement: Element;
    private menu: d3.Selection<d3.BaseType, {}, null, undefined>;
    private timeoutId: any;

    constructor(containerElement: Element) {

        this.menu = d3.select(containerElement)
            .append("div")
            .classed("context-menu", true)
            .on("contextmenu", this.handleContextMenu)
            .on("mouseenter", this.handleMouseEnter)
            .on("mouseleave", this.handleMouseLeave);

        this.menuElement = this.menu.node() as Element;
    }

    private handleContextMenu = () => {

    }

    private handleMouseEnter = () => {
        if(this.isVisible) {
            this.timeoutId = setTimeout(() => this.hide(), this.hideDelay)
        }
    }

    private handleMouseLeave = () => {
        if(this.isVisible) {
            clearTimeout(this.timeoutId);
        }
    }

    public hide() {
        this.isVisible = false;

        this.menu
            .html('');

        this.menu
            .style('display', 'none');
    }

}

class Menu {
    items: Array<Item>;
}

interface Item {
    isDisabled: boolean;
    isDivider: boolean;

}
