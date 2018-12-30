import { uuid } from 'lodash-uuid';

import { Component } from './component';
import { Context } from './core/context';
import { EditorEvents } from './events';
import { Input } from './input';
import { Link, LinkImportExport } from './link';
import { Node, NodeImportExport } from './node';
import { Output } from './output';
import { Selected } from './selected';
import { EditorView } from './view/index';

export type EditorImportExport = {
    id: string;
    nodes: NodeImportExport[];
    links: LinkImportExport[];
};
export class NodeEditor extends Context {
    nodes: Array<Node>;
    links: Array<Link>;
    components: Map<string, Component>;

    selected: Selected;
    view: EditorView;

    private container: HTMLElement;

    constructor(container: HTMLElement, id: string = uuid()) {
        super(id, new EditorEvents());

        this.container = container;
        this.links = [];
        this.nodes = [];
        this.components = new Map();

        this.selected = new Selected();
        this.view = new EditorView(container, this.components, this);

        this.bind('clear');

        window.addEventListener('keydown', e => this.trigger('keydown', e));
        window.addEventListener('keyup', e => this.trigger('keyup', e));
        this.on('nodecreated', node =>
            this.getComponent(node.name).created(node)
        );
        this.on('noderemoved', node =>
            this.getComponent(node.name).destroyed(node)
        );
        this.on('selectnode', ({ node, accumulate }) =>
            this.selectNode(node, accumulate)
        );
        this.on('click', ({ e, container }) =>
            this.deselectAllNodes(e, container)
        );
    }

    addNode(node: Node) {
        if (!this.trigger('nodecreate', node)) return;

        this.nodes.push(node);
        this.view.addNode(node);

        this.trigger('nodecreated', node);
    }

    removeNode(node: Node) {
        if (!this.trigger('noderemove', node)) return;

        node.getLinks().forEach(c => this.removeLink(c));

        this.nodes.removeItem(node);
        this.view.removeNode(node);

        this.trigger('noderemoved', node);
    }

    connect(output: Output, input: Input, data = {}) {
        if (!this.trigger('linkcreate', { output, input })) return;

        try {
            const link = output.connectTo(input);

            link.data = data;
            this.view.addLink(link);
            this.links.push(link);

            this.trigger('linkcreated', link);
        } catch (e) {
            this.trigger('warn', e);
        }
    }

    removeLink(link: Link) {
        if (!this.trigger('linkremove', link)) return;

        this.view.removeLink(link);
        this.links.removeItem(link);
        link.remove();

        this.trigger('linkremoved', link);
    }

    selectNode(node: Node, accumulate: boolean = false) {
        if (this.nodes.indexOf(node) === -1)
            throw new Error('Node does not exist in list');

        if (!this.trigger('nodeselect', node)) return;

        this.selected.add(node, accumulate);

        this.trigger('nodeselected', node);
    }

    getComponent(name) {
        const component = this.components.get(name);

        if (!component) throw `Component ${name} not found`;

        return component;
    }

    register(component: Component) {
        component.editor = this;
        this.components.set(component.name, component);
        this.trigger('componentregister', component);
    }

    clear() {
        [...this.nodes].map(node => this.removeNode(node));
        this.trigger('clear');
    }

    private deselectAllNodes = (e, container: HTMLElement) => {
        const target = e.target;
        if (target) {
            const targetClass = target.className as string;
            if (
                target === this.container ||
                (targetClass && targetClass.indexOf('background') >= 0)
            ) {
                const clones = this.selected.getSelected().slice(0);
                this.selected.clear();
                clones.forEach(x => this.trigger('nodedeselected', x));
            }
        }
    };

    static validate(data: EditorImportExport): boolean {
        return false;
    }

    toJSON(): EditorImportExport {
        const editorExport = {
            id: this.id,
            nodes: this.nodes.map(x => x.toJSON()),
            links: this.links.map(x => x.toJson()),
        };

        this.trigger('export', editorExport);
        return editorExport;
    }

    private beforeImport(json: Object) {
        // var checking = Validator.validate(this.id, json);

        // if (!checking.success) {
        //     this.trigger('warn', checking.msg);
        //     return false;
        // }

        this.silent = true;
        this.clear();
        this.trigger('import', json);
        return true;
    }

    private afterImport() {
        this.silent = false;
        return true;
    }

    async fromJSON(json: EditorImportExport) {
        if (!this.beforeImport(json)) return false;

        this.id = json.id;
        let nodes: Map<string, Node> = new Map();

        try {
            const jsonNodes = json.nodes || [];
            await Promise.all(
                jsonNodes.map(async node => {
                    const component = this.getComponent(node.fullName);
                    const newNode = await component.build(Node.fromJSON(node));

                    nodes.set(newNode.id, newNode);
                    this.addNode(newNode);
                })
            );

            const jsonLinks = json.links || [];
            jsonLinks.map(link => {
                const sourceNode = nodes.get(link.sourceNode);
                const destinationNode = nodes.get(link.destinationNode);

                if (sourceNode && destinationNode) {
                    const output = sourceNode.outputs.get(link.sourceKey);
                    const input = destinationNode.inputs.get(
                        link.destinationKey
                    );

                    if (output && input) {
                        this.connect(
                            output,
                            input
                        );
                    }
                }
            });
        } catch (e) {
            this.trigger('warn', e);
            return !this.afterImport();
        } finally {
            return this.afterImport();
        }
    }
}
