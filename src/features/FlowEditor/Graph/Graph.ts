import { Observable } from './../utils/Observable';
import * as d3 from 'd3';
import { observable, action } from 'mobx';
import { store } from '..';
import { AnyPort, FlowPort } from '../Node/Ports/types';

class Graph {

    private camera : any;

    @observable
    public position : XYCoords = [0, 0];
    @observable
    public mounted: boolean = false;
    @observable
    public mousePosition : XYCoords = [NaN, NaN];

    public scale : number = 1;

    public initialize = (size: [number, number], zoomRange: [number, number]) => {

        const [width, height] = size;
        const [halfWidth, halfHeight] = [width / 2, height / 2];

        const zoom = d3.zoom()
            .scaleExtent(zoomRange!)
            .translateExtent([[-halfWidth, -halfHeight], [halfWidth, halfHeight]])
            .on("zoom", this.handleCamera);

        d3.select("#_graph")
            .call(zoom);

        d3.select(document)
            .on("mousemove", this.handleMouseMove);

        // For some reason I need this for it to actually properly scale
        setTimeout(() => this.mounted = true, 100);
    }

    private handleMouseMove = () => {
        // if(!store.linking) return;

        const { clientX, clientY } = d3.event;
        this.mousePosition = this.convertCoords([clientX, clientY]);
    }

    public startLink = action((port: AnyPort, sourcePos: XYCoords) => {
        d3.select(document)
            .on("mouseup", this.handleLinkMouseUp);
        store.linking = { from: port, sourcePos: this.convertCoords(sourcePos), mouse: this.convertCoords(this.mousePosition) };
    })

    public stopLink = action(() => {
        d3.select(document)
            .on("mouseup", null);
        store.linking = undefined;
    });

    public attackLink = action((to: AnyPort) => {
        this.stopLink();
    })

    private handleLinkMouseUp = () => {
        this.stopLink();
    }

    public convertCoords = (coords: XYCoords) : XYCoords => {
        const pt = (d3.select("#_graph").node() as any).createSVGPoint();
        pt.x = coords[0];
        pt.y = coords[1];
        const newCoords = pt.matrixTransform((d3.select("#_graph-view").node() as any).getScreenCTM()!.inverse());
        return [newCoords.x, newCoords.y];
    }

    public reset = () : void => {
        d3.select("#_graph")
            .transition()
            .duration(500)
            .call(this.camera.transform, d3.zoomIdentity);
    }

    private handleCamera = () => {
        const transform = d3.event.transform;
        const canvas = d3.select("#_graph-view");
        canvas.attr("transform", transform);
        
        if(transform.k !== this.scale) {
            this.scale = transform.k;
        }
    }

}

export { Graph };