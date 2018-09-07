import { XYCoords } from './../../Editor/utils/types.d';
import { uuid } from "lodash-uuid";
import { observable, computed, action } from "mobx";
import { InputValuePort, OutputValuePort } from './Ports/ValuePort';
import { InputFlowPort, OutputFlowPort } from './Ports/FlowPort';
import { store } from '../store';
import { Link } from '../Link';
import { ValuePort, FlowPort, AnyPort } from './Ports/types';
import _ from 'lodash';

class Node
{
    id = uuid();

    @observable position: XYCoords;
    @observable allPorts: Array<AnyPort>;

    @computed
    public get valuePorts() : Array<ValuePort> {
        return this.allPorts.filter(x => x instanceof InputValuePort || x instanceof OutputValuePort) as Array<ValuePort>;
    }

    @computed
    public get flowPorts() : Array<FlowPort> {
        return this.allPorts.filter(x => x instanceof InputFlowPort || x instanceof OutputFlowPort) as Array<FlowPort>;
    }

    @computed
    public get links() : Array<Link> {
        return store.links.filter(x => x.source.node === this || x.destination.node === this);
    }

    constructor(position: XYCoords) {
        this.position = position;
    }

    public handleDragStart = (e: React.MouseEvent) => {

        const handleMove = action((e: MouseEvent) => {

        });

        const handleUp = () => {
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseup", handleUp);
        }

        document.addEventListener("mouseup", handleUp);
        document.addEventListener("mousemove", handleMove);
    }

    public remove = () => {
        this.links.forEach(x => x.remove());
        _.remove(store.nodes, this);
    }

}

export { Node };