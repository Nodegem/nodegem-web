import { Area as AreaView } from './area';
import { Connection } from '../connection';
import { Emitter } from '../core/emitter';
import { Node } from '../node';
import { Connection as ConnectionView } from './connection';
import { Node as NodeView } from './node';
import { Socket as SocketView } from './socket';
import { Control as ControlView } from './control';
import { Zoom } from './zoom';
import { Drag } from './drag';

class EditorView extends Emitter {

    container: HTMLElement;
    components: any;
    emitter: Emitter;
    nodes: Map<Node, NodeView>;
    connections: Map<Connection, ConnectionView>;
    area: AreaView;

    constructor(container: HTMLElement, components: any, emitter: Emitter) {
        super(emitter);

        this.container = container;
        this.components = components;

        this.container.style.overflow = 'hidden';

        this.nodes = new Map();
        this.connections = new Map();

        this.container.addEventListener('click', this.click.bind(this));
        this.container.addEventListener('contextmenu', e => this.trigger('contextmenu', { e, view: this }));
        window.addEventListener('resize', this.resize.bind(this));

        this.on('nodetranslated', this.updateConnections.bind(this));
            
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

    addConnection(connection: Connection) {
        const viewInput = this.nodes.get(connection.input.node!)!;
        const viewOutput = this.nodes.get(connection.output.node!)!;
        const connView = new ConnectionView(connection, viewInput, viewOutput, this);

        this.connections.set(connection, connView);
        this.area.appendChild(connView.el);
    }

    removeConnection(connection: Connection) {
        const connView = this.connections.get(connection)!;

        this.connections.delete(connection);
        this.area.removeChild(connView.el);
    }

    updateConnections({ node }) {
        node.getConnections().map(conn => {
            this.connections.get(conn)!.update();
        });
    }

    resize() {
        const { container } = this;

        container.style.width = 100 + '%';
        container.style.height = 100 + '%';
    }

    click(e) {
        const container = this.container;
        
        if (container !== e.target) return;
        if (!this.trigger('click', { e, container })) return;
    }
}

export {
    EditorView,
    AreaView,
    NodeView,
    SocketView,
    ControlView,
    ConnectionView,
    Drag,
    Zoom
}