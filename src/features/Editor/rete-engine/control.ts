import { Node } from './node';

export abstract class Control {

    public key: string;
    public data: any;
    public parent: any;

    constructor(key: string) {
        this.key = key;
        this.data = {};
        this.parent = null;
    }

    getNode() : Node {
        if (this.parent === null)
            throw new Error("Control isn't added to Node/Input");   
        
        return this.parent instanceof Node ? this.parent : this.parent.node;
    }

    getData<T = any>(key: string) : T | null {
        return this.getNode().data[key];
    }

    putData(key: string, data: any) {
        this.getNode().data[key] = data;
    }  
}