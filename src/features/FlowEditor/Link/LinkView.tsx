import * as React from "react";
import { FlowLink, ValueLink } from ".";
import * as d3 from 'd3';
import { observer } from "mobx-react";
import { store } from "..";

const lineFunc = d3.line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveBasis);

const lineTransform = (coords: [XYCoords, XYCoords]): Array<XYCoords> => {
    const offset = 45;
    const [startX, startY] = coords[0];
    const [endX, endY] = coords[1];
    return [
        [startX, startY],
        [startX + offset, startY],
        [endX - offset, endY],
        [endX, endY]
    ];
}

const FlowMarker = ({}) => {
    return (
        <marker id="marker-arrow" className="flow-arrow-marker" markerWidth="12" markerHeight="12" refX="6" refY="4" orient="auto" stroke="lightgreen" fill="lightgreen" viewBox="0 0 20 20">
            <path d="M 1 1 7 4 1 7 Z" />
        </marker>
    )
}

const LinkHandleView = ({ d } : { d: string }) => {
    return (
        <path d={d} className="link-handle" fill="none" strokeWidth={12} stroke="none" />
    );
}

const BaseValueLinkView = ({ d, sourcePos, destPos }: { d: string, sourcePos: XYCoords, destPos: XYCoords }) => {
    return (
        <g>
            <path d={d} stroke="red" className="link value" strokeWidth={3} fill="none" />
            <circle className="link-value-handle" cx={sourcePos[0]} cy={sourcePos[1]} r={3} stroke="red" />
            <circle className="link-value-handle" cx={destPos[0]} cy={destPos[1]} r={3} stroke="red" />
        </g>
    )
}

const BaseFlowLinkView = ({ d, sourcePos, destPos }: { d: string, sourcePos: XYCoords, destPos: XYCoords }) => {
    return (
        <path d={d} className="link flow" stroke="lightgreen" markerEnd="url(#marker-arrow)" strokeWidth={3} fill="none" />
    )
}

const DrawFlowLinkView = ({ sourcePos, destPos }: { sourcePos: XYCoords, destPos: XYCoords }) => {
    const data = lineFunc(lineTransform([sourcePos, destPos]))!;
    return (
        <BaseFlowLinkView d={data} sourcePos={sourcePos} destPos={destPos} />
    )
}

const DrawValueLinkView = ({ sourcePos, destPos }: { sourcePos: XYCoords, destPos: XYCoords }) => {
    const data = lineFunc(lineTransform([sourcePos, destPos]))!;
    return (
        <BaseValueLinkView d={data} sourcePos={sourcePos} destPos={destPos} />
    )
}

const FlowLinkView = observer(({ link }: { link: FlowLink }) => {
    const sourceCoords = store.graph.convertCoords(link.source.port.centerCoords);
    const destCoords = store.graph.convertCoords(link.destination.port.centerCoords);
    destCoords[0] -= 17;

    const data = lineFunc(lineTransform([sourceCoords, destCoords]))!;
    return (
        <g>
            <BaseFlowLinkView d={data} sourcePos={sourceCoords} destPos={destCoords} />
            <LinkHandleView d={data} />
        </g>
    )
})

const ValueLinkView = observer(({ link }: { link: ValueLink }) => {
    const sourceCoords = store.graph.convertCoords(link.source.port.centerCoords);
    const destCoords = store.graph.convertCoords(link.destination.port.centerCoords);

    const data = lineFunc(lineTransform([sourceCoords, destCoords]))!;
    return (
        <g>
            <BaseValueLinkView d={data} sourcePos={sourceCoords} destPos={destCoords} />
            <LinkHandleView d={data} />
        </g>
    )
})

export { DrawFlowLinkView, DrawValueLinkView, FlowLinkView, ValueLinkView, FlowMarker };