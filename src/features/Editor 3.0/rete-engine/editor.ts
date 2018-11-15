import { Component } from './component';
import { Link, LinkImportExport } from './link';
import { Context } from './core/context';
import { EditorEvents } from './events';
import { EditorView } from './view/index';
import { Input } from './input';
import { Node, NodeImportExport } from './node';
import { Output } from './output';
import { Selected } from './selected';

export type EditorImportExport = { nodes: NodeImportExport[], links: LinkImportExport[] }
export class NodeEditor extends Context {

    nodes: Array<Node>;
    links: Array<Link>;
    components: Map<string, Component>;

    selected: Selected;
    view: EditorView;

    constructor(id: string, container: HTMLElement) {
        super(id, new EditorEvents());
        
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

        this.nodes.splice(this.nodes.indexOf(node), 1);
        this.view.removeNode(node);

        this.trigger('noderemoved', node);
    }

    connect(output: Output, input: Input, data = {}) {
        if (!this.trigger('linkcreate', { output, input })) return;

        try {
            const link = output.connectTo(input);

            link.data = data;
            this.view.addLink(link);

            this.trigger('linkcreated', link);
        } catch (e) {
            this.trigger('warn', e)
        }
    }

    removeLink(link: Link) {
        if (!this.trigger('linkremove', link)) return;
            
        this.view.removeLink(link);
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
        let editorExport = { nodes: [], links: [] };

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

    async fromJSON(json: any) {
        if (!this.beforeImport(json)) return false;
        let nodes = {};

        try {
            await Promise.all(Object.keys(json.nodes).map(async id => {
                const node = json.nodes[id];
                const component = this.getComponent(node.name);

                nodes[id] = await component.build(Node.fromJSON(node));
                this.addNode(nodes[id]);
            }));
        
            // Object.keys(json.nodes).forEach(id => {
            //     var jsonNode = json.nodes[id];
            //     var node = nodes[id];
            //     console.log(node, jsonNode);
                
            //     if(jsonNode.outputs) {
            //         Object.keys(jsonNode.outputs).forEach(key => {
            //             var outputJson = jsonNode.outputs[key];
    
            //             outputJson.connections.forEach(jsonConnection => {
            //                 var nodeId = jsonConnection.node;
            //                 var data = jsonConnection.data;
            //                 var targetOutput = node.outputs.get(key);
            //                 var targetInput = nodes[nodeId].inputs.get(jsonConnection.input);
    
            //                 this.connect(targetOutput, targetInput, data);
            //             });
            //         });
            //     }
            // });
        }
        catch (e) {
            this.trigger('warn', e);
            return !this.afterImport();
        } finally {
            return this.afterImport();
        }
    }
}
