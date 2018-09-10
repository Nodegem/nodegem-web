import { uuid } from "lodash-uuid";
import { observable, computed, action } from "mobx";
import { InputValuePort, OutputValuePort } from './Ports/ValuePort';
import { InputFlowPort, OutputFlowPort } from './Ports/FlowPort';
import { Link } from '../Link';
import { ValuePort, FlowPort, AnyPort } from './Ports/types';
import _ from 'lodash';
import { store } from '..';

class Node
{
    id = uuid();

    type: string;
    title: string;
    @observable position: XYCoords;
    @observable allPorts: Array<AnyPort> = [];

    public get valuePorts() : Array<ValuePort> {
        return this.allPorts.filter(x => x instanceof InputValuePort || x instanceof OutputValuePort) as Array<ValuePort>;
    }

    public get flowPorts() : Array<FlowPort> {
        return this.allPorts.filter(x => x instanceof InputFlowPort || x instanceof OutputFlowPort) as Array<FlowPort>;
    }

    public get numInputs() : number {
        return this.inputFlowPorts.length + this.inputValuePorts.length;
    }

    public get numOutputs() : number {
        return this.outputFlowPorts.length + this.outputValuePorts.length;
    }

    @computed    
    public get inputValuePorts() : Array<InputValuePort> {
        return this.valuePorts.filter(x => x instanceof InputValuePort) as Array<InputValuePort>;
    }

    @computed
    public get inputFlowPorts() : Array<InputFlowPort> {
        return this.flowPorts.filter(x => x instanceof InputFlowPort) as Array<InputFlowPort>;
    }

    @computed
    public get outputValuePorts() : Array<OutputValuePort> {
        return this.valuePorts.filter(x => x instanceof OutputValuePort) as Array<OutputValuePort>;
    }

    @computed
    public get outputFlowPorts() : Array<OutputFlowPort> {
        return this.flowPorts.filter(x => x instanceof OutputFlowPort) as Array<OutputFlowPort>;
    }

    @computed
    public get links() : Array<Link> {
        return store.links.filter(x => x.source.node === this || x.destination.node === this);
    }

    constructor(title: string, type: string, position: XYCoords | undefined = undefined) {
        this.title = title;
        this.type = type;
        this.position = position || [0, 0];
    }

    public handleDragStart = (e: React.MouseEvent) => {

        const clientOffset = this.convert([e.clientX, e.clientY]);
        const offset = [clientOffset[0] - this.position[0], clientOffset[1] - this.position[1]];

        const handleMove = action((e: MouseEvent) => {
            const newPos = this.convert([e.clientX, e.clientY]);
            this.position = [newPos[0] - offset[0], newPos[1] - offset[1]];
        });

        const handleUp = () => {
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseup", handleUp);
        }

        document.addEventListener("mouseup", handleUp);
        document.addEventListener("mousemove", handleMove);
    }

    private convert = (coords: XYCoords) : XYCoords => {
        return store.graph.convertCoords(coords);
    }

    public remove = () => {
        this.links.forEach(x => x.remove());
        _.remove(store.nodes, this);
    }

}

export { Node };