import { XYCoords } from './../../Editor/utils/types.d';
import { uuid } from "lodash-uuid";
import { observable, computed } from "mobx";
import { InputValuePort, OutputValuePort } from './Ports/ValuePort';
import { InputFlowPort, OutputFlowPort } from './Ports/FlowPort';

type FlowPort = InputFlowPort | OutputFlowPort;
type ValuePort = InputValuePort | OutputValuePort;

class Node
{
    id = uuid();

    @observable position: XYCoords;
    @observable allPorts: Array<ValuePort | FlowPort>;

    @computed
    get valuePorts() : Array<ValuePort> {
        return this.allPorts.filter(x => x instanceof InputValuePort || x instanceof OutputValuePort) as Array<ValuePort>;
    }

    @computed
    get flowPorts() : Array<FlowPort> {
        return this.allPorts.filter(x => x instanceof InputFlowPort || x instanceof OutputFlowPort) as Array<FlowPort>;
    }

    @computed
    get connections() : [] {
        return [];
    }

    constructor(position: XYCoords) {
        this.position = position;
    }
}

export { Node };