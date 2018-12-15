import { Emitter } from '../core/emitter';
import { Link } from '../link';
import { Node } from '../node';
import { Area as AreaView } from './area';
import { Control as ControlView } from './control';
import { Drag } from './drag';
import { Link as LinkView } from './link';
import { Node as NodeView } from './node';
import { Socket as SocketView } from './socket';
import { Zoom } from './zoom';

class EditorView extends Emitter {

    container: HTMLElement;
    components: any;
    emitter: Emitter;
    nodes: Map<Node, NodeView>;
    links: Map<Link, LinkView>;
    area: AreaView;

    constructor(container: HTMLElement, components: any, emitter: Emitter) {
        super(emitter);

        this.container = container;
        this.components = components;

        this.container.style.overflow = 'hidden';

        this.nodes = new Map();
        this.links = new Map();

        this.container.addEventListener('click', this.click.bind(this));
        this.container.addEventListener('contextmenu', e => this.trigger('contextmenu', { e, view: this }));
        window.addEventListener('resize', this.resize.bind(this));

        this.on('nodetranslated', this.updateLinks.bind(this));
            
        this.area = new AreaView(container, this);
        this.container.appendChild(this.area.el);
    }

    addNode(node: Node) {
        const nodeView = new NodeView(node, this.components.get(node.name), this);

        this.nodes.set(node, nodeView);
        this.area.appendChild(nodeView.el);
    }

    removeNode(node: Node) {
        const nodeView = this.nodes.get(node)!;

        this.nodes.delete(node);
        this.area.removeChild(nodeView.el);
    }

    addLink(link: Link) {
        const viewInput = this.nodes.get(link.input.node!)!;
        const viewOutput = this.nodes.get(link.output.node!)!;
        const connView = new LinkView(link, viewInput, viewOutput, this);

        this.links.set(link, connView);
        this.area.appendChild(connView.el);
    }

    removeLink(link: Link) {
        const connView = this.links.get(link)!;

        this.links.delete(link);
        this.area.removeChild(connView.el);
    }

    updateLinks({ node }) {
        node.getLinks().map(conn => {
            this.links.get(conn)!.update();
        });
    }

    resize() {
        const { container } = this;

        container.style.width = '100%';
    }

    click(e) {
        const container = this.container;
        if (!this.trigger('click', { e, container })) return;
    }
}

export {
    EditorView,
    AreaView,
    NodeView,
    SocketView,
    ControlView,
    LinkView,
    Drag,
    Zoom
}