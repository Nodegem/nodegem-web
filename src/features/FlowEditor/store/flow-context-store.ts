import { observable, action } from "mobx";
import { Menu } from "../FlowContextMenu/FlowContextMenuView";
import * as d3 from 'd3';

class FlowContextStore {
    menuElement: Element;
    hideDelay = 250;
    @observable visible: boolean = false;
    @observable menu: Menu = { items: [] };
    @observable position: XYCoords = [0, 0];
    private timeoutId: any;

    public show = action((menu: Menu, position: XYCoords) => {
        this.menu = menu;
        this.position = position;
        this.visible = true;
        
        // Need this to trigger otherwise the first time it opens it stays open
        const element = d3.select(".context-menu").node() as Element;
        if(element) {
            element.dispatchEvent(new Event("mouseenter"));
        }
    })

    public hide = action(() => {
        this.visible = false;
    })

    public setTimer = () => {
        this.timeoutId = setTimeout(this.hide, this.hideDelay);
    }

    public stopTimer = () => {
        clearTimeout(this.timeoutId);
    }

}

export const flowContextStore = new FlowContextStore();