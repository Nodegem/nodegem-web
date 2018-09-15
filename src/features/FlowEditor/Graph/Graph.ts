import * as d3 from 'd3';
import { observable, action } from 'mobx';
import { store } from '..';
import { AnyPort } from '../Node/Ports/types';
import { FlowLink, ValueLink, LinkOptions } from '../Link';
import { OutputFlowPort, InputValuePort, OutputValuePort, InputFlowPort } from '../Node/Ports';

class Graph {

    private camera : any;

    @observable
    public position : XYCoords = [0, 0];
    @observable
    public mounted: boolean = false;
    @observable
    public mousePosition : XYCoords = [NaN, NaN];

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

        this.camera = zoom;

        // For some reason I need this for it to actually properly scale
        setTimeout(() => this.mounted = true, 100);
    }

    private handleMouseMove = () => {
        if(!store.linking) return;

        const { clientX, clientY } = d3.event;
        this.mousePosition = this.convertCoords([clientX, clientY]);
    }

    public startLink = action((port: AnyPort) => {
        d3.select(document)
            .on("mouseup", this.handleLinkMouseUp);
        
        const { clientX, clientY } = d3.event;
        this.mousePosition = this.convertCoords([clientX, clientY]);
        port.updateCenterCoords();
        store.linking = { from: port, sourcePos: this.convertCoords(port.centerCoords), mouse: this.convertCoords(this.mousePosition) };
    })

    public stopLink = action(() => {
        d3.select(document)
            .on("mouseup", null);
        store.linking = undefined;
    });

    public attachLink = action((to: AnyPort) => {

        if(!store.linking) return;

        const { from } = store.linking;

        if(from.type !== to.type) {
            this.stopLink();
            return;
        }

        const source = to.ioType === "output" ? to : from;
        const dest = to.ioType === "input" ? to : from;

        if(source === dest || source.node === dest.node) {
            this.stopLink();
            return;
        } 
        
        let newLink : LinkOptions;

        if(from.type === "flow") {
            newLink = new FlowLink({ port: source as OutputFlowPort, node: source.node }, { port: dest as InputFlowPort, node: dest.node });
        } else {
            newLink = new ValueLink({ port: source as OutputValuePort, node: source.node }, { port: dest as InputValuePort, node: dest.node });
        }

        to.updateCenterCoords();
        source.setPort(dest);
        dest.setPort(source);
        source.node.addLink(newLink);
        dest.node.addLink(newLink);

        store.links.push(newLink);

        this.stopLink();
    })

    public detachLink = action((from: AnyPort) => {

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
    }

}

export { Graph };