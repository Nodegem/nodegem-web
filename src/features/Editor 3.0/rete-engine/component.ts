import { Component as ComponentWorker } from './engine/component';
import { Node } from './node';

export abstract class Component extends ComponentWorker {

    editor: any;
    data: object;

    constructor(name) {
        super(name);
        this.editor = null;
        this.data = {};
    }

    async builder(node: Node) { }

    created(node: Node) { }

    destroyed(node: Node) { }

    async build(node: Node) {
        await this.builder(node);

        return node;
    }

    async createNode(data: any = {}) {
        const node = new Node(this.name);
        
        node.data = data;
        await this.build(node);

        return node;
    }
}