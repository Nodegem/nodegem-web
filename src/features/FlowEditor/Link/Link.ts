import { uuid } from "lodash-uuid";
import { Node } from '../Node';

interface Connection {
    node: Node;
    port: any;
}

class Link {

    id = uuid();

    source: Connection;
    destination: Connection;

    constructor(source: Connection, destination: Connection) {
        this.source = source;
        this.destination = destination;
    }

    public remove = () => {
        
    }

}

export { Link, Connection };