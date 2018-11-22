import { Component } from './component';
import { Link, LinkImportExport } from './link';
import { Context } from './core/context';
import { EditorEvents } from './events';
import { EditorView } from './view/index';
import { Input } from './input';
import { Node, NodeImportExport } from './node';
import { Output } from './output';
import { Selected } from './selected';

export type EditorImportExport = { id: string, nodes: NodeImportExport[], links: LinkImportExport[] }
export class NodeEditor extends Context {

    nodes: Array<Node>;
    links: Array<Link>;
    components: Map<string, Component>;

    selected: Selected;
    view: EditorView;

    constructor(id: string, container: HTMLElement) {
        super(id, new EditorEvents());
        
        this.links = [];
        this.nodes = [];
        this.components = new Map();

        this.selected = new Selected();
        this.view = new EditorView(container, this.components, this);

        window.addEventListener('keydown', e => this.trigger('keydown', e));
        window.addEventListener('keyup', e => this.trigger('keyup', e));
        this.on('nodecreated', node => this.getComponent(node.name).created(node));
        this.on('noderemoved', node => this.getComponent(node.name).destroyed(node));
        this.on('selectnode', ({ node, accumulate }) => this.selectNode(node, accumulate));
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
            this.trigger('warn', e)
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
            throw new Error('Node not exist in list');
        
        if (!this.trigger('nodeselect', node)) return;

        this.selected.add(node, accumulate);
        
        this.trigger('nodeselected', node);
    }

    getComponent(name) {
        const component = this.components.get(name);

        if (!component)
            throw `Component ${name} not found`;
        
        return component;
    }

    register(component: Component) {
        component.editor = this;
        this.components.set(component.name, component);
        this.trigger('componentregister', component)
    }

    clear() {
        [...this.nodes].map(node => this.removeNode(node));
    }

    toJSON() : EditorImportExport {
        const editorExport = { 
            id: this.id, 
            nodes: this.nodes.map(x => x.toJSON()), 
            links: this.links.map(x => x.toJson()) 
        };

        this.trigger('export', editorExport);
        return editorExport;
    }

    beforeImport(json: Object) {
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

    afterImport() {
        this.silent = false;
        return true;
    }

    async fromJSON(json: EditorImportExport) {
        if (!this.beforeImport(json)) return false;
        let nodes : Map<string, Node> = new Map();

        try {
            await Promise.all(json.nodes.map(async node => {
                const component = this.getComponent(node.namespace);
                const newNode = await component.build(Node.fromJSON(node));

                nodes.set(newNode.id, newNode);
                this.addNode(newNode);
            }));

            json.links.map(link => {
                const sourceNode = nodes.get(link.sourceNode);
                const destinationNode = nodes.get(link.destinationNode);

                if(sourceNode && destinationNode) {
                    const output = sourceNode.outputs.get(link.sourceKey);
                    const input = destinationNode.inputs.get(link.destinationKey);

                    if(output && input) {
                        this.connect(output, input);
                    }
                }
            });
        }
        catch (e) {
            this.trigger('warn', e);
            return !this.afterImport();
        } finally {
            return this.afterImport();
        }
    }
}
