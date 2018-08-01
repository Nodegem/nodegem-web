import React, { PureComponent } from "react";
import * as d3 from "d3";
import { ZoomBehavior, ZoomTransform } from "d3";

import "./Canvas.scss";

export type CanvasProps = {
    size: [number, number];
    zoomInputFilter?: (ev: any) => boolean;
    onZoom?: (canvas: HTMLElement, transform: any) => void;
    zoomRange?: [number, number];
    color?: string;
    fillId?: string;
    pattern?: JSX.Element;
    className?: string;
}

export type CanvasState = {
    zoom: ZoomBehavior<Element, {}> | null
}

export default class Canvas extends PureComponent<CanvasProps, CanvasState> {

    static defaultProps = {
        zoomRange: [1, 1],
        color: "white",
        onZoom: () => {},
    }

    constructor(props: CanvasProps) {
        super(props);

        this.state = {
            zoom: null
        };
    }

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

        this.setState({zoom: zoom})
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

        this.props.onZoom!(canvas.node() as HTMLElement, transform);
    }

    public reset() : void {
        d3.select("#_canvas")
            .transition()
            .duration(500)
            .call(this.state.zoom!.transform as any, d3.zoomIdentity);
    }

    public setCameraTransform({x, y, scale} : {x: number, y: number, scale: number}) : void {
        d3.select("#_canvas") //this may be canvas-view... idk
            .call(this.state.zoom!.transform, d3.zoomIdentity.translate(x, y).scale(scale));
    }

    public render() {

        const { pattern, className, size, color, 
            fillId, onZoom, zoomInputFilter, zoomRange, 
            ...rest } = this.props;

        const [ width, height ] = size;
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        return (
            <svg className={`canvas ${className || ""}`} id="_canvas" {...rest}>
                <defs>
                    {pattern}
                </defs>
                <g id="_canvas-view" transform={d3.zoomIdentity.toString()}>
                    <rect x={-halfWidth} y={-halfHeight} 
                            width={width} height={height} 
                            className="canvas-background" id="_canvas-background" 
                            style={{ fill: (fillId ? `url("${fillId}")` : "none"), backgroundColor: color }} />
                            
                        {this.props.children}
                </g>
            </svg>
        );
    }

}