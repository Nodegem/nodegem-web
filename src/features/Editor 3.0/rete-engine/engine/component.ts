import { Engine } from ".";

export abstract class Component {

    public name: string;
    data: object;
    engine: Engine | null;

    constructor(name) {
        if (this.constructor === Component)
            throw new TypeError('Can not construct abstract class.');
        
        this.name = name;
        this.data = {};
        this.engine = null;
    }

    worker(node: any, inputs: any, outputs: any, ...args: any[]) { }
}