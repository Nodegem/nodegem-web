import * as React from "react";
import { FlowLink, ValueLink } from ".";
import * as d3 from 'd3';
import { observer } from "mobx-react";

const lineFunc = d3.line()
                        .x(d => d[0])
                        .y(d => d[1])
                        .curve(d3.curveBasis);

const lineTransform = (coords: [XYCoords, XYCoords]) : Array<XYCoords> => {
    const offset = 30;
    const [startX, startY] = coords[0];
    const [endX, endY] = coords[1];
    return [
        [startX, startY],
        [startX + offset, startY],
        [endX - offset, endY],
        [endX, endY]
    ];
}

const DrawFlowLinkView = observer(({ }) => {
    return (
        <></>
    )
})

const DrawValueLinkView = ({ sourcePos, destPos } : { sourcePos: XYCoords, destPos: XYCoords }) => {
    return (
        <path d={lineFunc(lineTransform([sourcePos, destPos]))!} stroke="red" strokeWidth={5} fill="none" />
    )
}

const FlowLinkView = ({ link } : { link : FlowLink }) => {
    return (
        <div></div>
    )
}

const ValueLinkView = ({ link } : { link : ValueLink }) => {
    return (
        <div></div>
    )
}

export { DrawFlowLinkView, DrawValueLinkView, FlowLinkView, ValueLinkView };