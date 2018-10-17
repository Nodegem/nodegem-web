import { Component as ComponentWorker } from './engine/component';
import { Node } from './node';

export class Component extends ComponentWorker {

    editor: any;
    data: object;

    constructor(name) {
        super(name);
        if (this.constructor === Component)
            throw new TypeError('Can not construct abstract class.');

        this.editor = null;
        this.data = {};
    }

    async builder(node: Node) { }

    created() { }

    destroyed() { }

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