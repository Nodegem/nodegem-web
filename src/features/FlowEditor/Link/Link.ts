import { OutputFlowPort, InputFlowPort } from "../Node/Ports/FlowPort";
import { Node } from '../Node';
import { FlowPort, AnyPort, ValuePort } from "../Node/Ports/types";
import { OutputValuePort, InputValuePort } from '../Node/Ports/ValuePort';
import _ from 'lodash';
import shortId from 'shortid';

interface Connection<T extends AnyPort> {
    node: Node;
    port: T;
}

class Link<T extends AnyPort> {

    id = shortId();

    source: Connection<T>;
    destination: Connection<T>;

    constructor(source: Connection<T>, destination: Connection<T>) {
        this.source = source;
        this.destination = destination;
    }

}

class FlowLink extends Link<FlowPort> {

    constructor(source: Connection<OutputFlowPort>, destination: Connection<InputFlowPort>) {
        super(source, destination);
    }

}

class ValueLink extends Link<ValuePort> {
    
    constructor(source: Connection<OutputValuePort>, destination: Connection<InputValuePort>) {
        super(source, destination);
    }

}

type LinkOptions = ValueLink | FlowLink;

export { FlowLink, ValueLink, LinkOptions, Connection };