import React, { PureComponent } from "react";
import { XYCoords } from "../utils/types";
import { ReactFauxDomProps, withFauxDOM } from "react-faux-dom";
import * as d3 from "d3";
import Draggable from "../Draggable/Draggable";
import { DragData } from "../Draggable/DraggableCore";

export type LinkProps = {
    coords: XYCoords[];
    color?: string;
    size?: number;
}

type LinkFauxDom = {
    link: Element;
}

export type LinkState = {
    drawing: boolean;
}

class Link extends PureComponent<LinkProps & LinkFauxDom & ReactFauxDomProps, LinkState> {

    static defaultProps : Partial<LinkProps> = {
        color: "black",
        size: 1
    }
    
    componentDidMount() {
        const faux = this.props.connectFauxDOM("div", "link");
    }

    private lineFunction = () => {
        return d3.line()
            .x((d) => d[0])
            .y((d) => d[1])
            .curve(d3.curveLinear);
    }

    private onDragStart = (e: MouseEvent, data: DragData) : void | false => {
        return false;
    }

    private onDrag = (e: MouseEvent, data: DragData) => {

    }

    private onDragStop = (e: MouseEvent, data: DragData) => {

    }

    public render() {
        return (
            <Draggable onDragStart={this.onDragStart} onDrag={this.onDrag} onDragStop={this.onDragStop}>
                <div>I'm a link</div>
            </Draggable>
        )
    }

}

export default withFauxDOM(Link);