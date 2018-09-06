import React, { PureComponent } from "react";
import * as d3 from "d3";
import { ZoomBehavior } from "d3";
import classNames from "classnames";
import { XYCoords } from "../utils";

import "./Canvas.scss";

export type CanvasProps = {
    size: [number, number];
    resetTransitionTime?: number;
    zoomInputFilter?: (ev: any) => boolean;
    onRightClick?: (e: React.MouseEvent) => void;
    onZoomPan?: (canvas: HTMLElement, transform: [number, number, number]) => void;
    zoomRange?: [number, number];
    fillId?: string;
    pattern?: JSX.Element;
    className?: string;
}

export default class Canvas extends PureComponent<CanvasProps> {

    static defaultProps = {
        zoomRange: [1, 1],
        resetTransitionTime: 750,
        onZoomPan: () => {},
        onRightClick: () => {}
    }

    private _svg : SVGSVGElement;
    private _rect : SVGRectElement;
    public container : SVGGElement;
    private _zoom : ZoomBehavior<Element, {}>;

    componentDidMount() {

        const { zoomRange, size } = this.props;
        const [width, height] = size;
        const [halfWidth, halfHeight] = [width/2,height/2];

        const zoom = d3.zoom()
            .scaleExtent(zoomRange!)
            .translateExtent([[-halfWidth, -halfHeight], [halfWidth, halfHeight]])
            .filter(this.inputFilter)
            .on("zoom", this.handleZoom);

        d3.select("#_canvas")
            .call(zoom);

        this._zoom = zoom;
    }

    public svgPoint = (element: SVGSVGElement | SVGGElement, coords: XYCoords) : XYCoords => {
        const pt = this._svg.createSVGPoint();
        pt.x = coords[0];
        pt.y = coords[1];
        const newCoords = pt.matrixTransform(element.getScreenCTM()!.inverse());
        return [newCoords.x, newCoords.y];
    }

    private inputFilter = () : boolean => {
        if(this.props.zoomInputFilter) {
            return this.props.zoomInputFilter(d3.event);
        }

        return !d3.event.button;
    }

    private handleZoom = () => {

        const transform = d3.event.transform;
        const canvas = d3.select("#_canvas-view");
        canvas.attr("transform", transform);

        const {x, y, k} = transform;
        this.props.onZoomPan!(canvas.node() as HTMLElement, [x, y, k]);
    }

    public reset() : void {
        d3.select("#_canvas")
            .transition()
            .duration(this.props.resetTransitionTime!)
            .call(this._zoom!.transform as any, d3.zoomIdentity);
    }

    public setCameraTransform({x, y, scale} : {x: number, y: number, scale: number}) : void {
        d3.select("#_canvas")
            .transition()
            .duration(250)
            .call(this._zoom!.transform as any, d3.zoomIdentity.translate(x, y).scale(scale));
    }

    public isElementCanvas = (element: Element) : boolean => {
        return element === this._svg || element === this._rect;
    }

    public render() {

        const { pattern, className, size, 
            fillId, onZoomPan, zoomInputFilter, zoomRange,
            resetTransitionTime, onRightClick, ...rest } = this.props;

        const [ width, height ] = size;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        const canvasClass = classNames({
            "canvas": true,
            [className!]: !!className
        });

        return (
            <svg ref={(s) => this._svg = s!} className={canvasClass} id="_canvas" {...rest}>
                <defs>
                    {pattern}
                </defs>
                <g ref={(g) => this.container = g!} id="_canvas-view" transform={d3.zoomIdentity.toString()}>
                    <rect ref={(r) => this._rect = r!} x={-halfWidth} y={-halfHeight} 
                            width={width} height={height} 
                            className="canvas-background" id="_canvas-background"
                            onContextMenu={onRightClick} 
                            style={{ fill: (fillId ? `url("${fillId}")` : "none") }} />
                            
                        {this.props.children}
                </g>
            </svg>
        );
    }

}