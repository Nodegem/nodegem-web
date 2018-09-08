import * as d3 from 'd3';

class Graph {

    private camera : any;

    public initialize = (size: [number, number], zoomRange: [number, number]) => {

        const [width, height] = size;
        const [halfWidth, halfHeight] = [width / 2, height / 2];

        this.camera = d3
            .zoom()
            .scaleExtent(zoomRange)
            .translateExtent([[-halfWidth, -halfHeight], [halfWidth, halfHeight]])
            .filter(this.inputFilter)
            .on("zoom", this.handleCamera);

        d3.select("#_graph")
            .call(this.camera);

    }

    public convertCoords = (coords: XYCoords) : XYCoords => {
        return [0, 0];
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
    }

    private inputFilter = (e: any) : boolean => {
        return true;
    }

}

export { Graph };