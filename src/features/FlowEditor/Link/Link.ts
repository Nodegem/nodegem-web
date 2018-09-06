import { Port } from "../Node/Ports/Port";
import { uuid } from "lodash-uuid";

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

}

export { Link };