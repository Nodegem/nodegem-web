import { Component } from '../component';
import { Control } from '../control';
import { Emitter } from '../core/emitter';
import { IO } from '../io';
import { Node as NodeData } from '../node';
import { Control as ViewControl } from './control';
import { Drag } from './drag';
import { Socket as ViewSocket } from './socket';

export class Node extends Emitter {
    public node: NodeData;
    public component: Component;
    public sockets: Map<IO, ViewSocket>;
    public controls: Map<Control, ViewControl>;
    public el: HTMLElement;

    private drag: Drag;
    private startPosition: [number, number];

    constructor(node: NodeData, component: Component, emitter: Emitter) {
        super(emitter);

        this.node = node;
        this.component = component;
        this.sockets = new Map();
        this.controls = new Map();
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';

        this.el.addEventListener('contextmenu', e =>
            this.trigger('contextmenu', { e, node: this.node })
        );

        this.startPosition = [0, 0];
        this.drag = new Drag(
            this.el,
            this.onTranslate.bind(this),
            this.onSelect.bind(this)
        );

        this.trigger('rendernode', {
            el: this.el,
            node,
            component,
            bindSocket: this.bindSocket.bind(this),
            bindControl: this.bindControl.bind(this),
        });

        this.update();
    }

    public bindSocket(el: HTMLElement, type: string, io: IO) {
        this.sockets.set(io, new ViewSocket(el, type, io, this.node, this));
    }

    public bindControl(el: HTMLElement, control: Control) {
        this.controls.set(control, new ViewControl(el, control, this));
    }

    public getSocketPosition(io) {
        return this.sockets.get(io)!.getPosition(this.node);
    }

    public onSelect(e) {
        this.startPosition = [...this.node.position] as [number, number];
        this.trigger('selectnode', { node: this.node, accumulate: e.ctrlKey });
    }

    public onTranslate(dx, dy) {
        const x = this.startPosition[0] + dx;
        const y = this.startPosition[1] + dy;

        this.translate(x, y);
    }

    public translate(x, y) {
        const node = this.node;
        const params = { node, x, y };

        if (!this.trigger('nodetranslate', params)) {
            return;
        }

        const prev = [...node.position];

        node.position[0] = params.x;
        node.position[1] = params.y;

        this.update();
        this.trigger('nodetranslated', { node, prev });
    }

    public update() {
        this.el.style.transform = `translate(${this.node.position[0]}px, ${
            this.node.position[1]
        }px)`;
    }

    public remove() {
        return null;
    }
}
