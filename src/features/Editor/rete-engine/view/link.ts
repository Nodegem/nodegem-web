import { Emitter } from '../core/emitter';
import { Link as LinkData } from '../link';
import { Node as ViewNode } from './node';

export class Link extends Emitter {

    link: LinkData;
    inputNode: ViewNode;
    outputNode: ViewNode;
    el: HTMLElement;

    constructor(link: LinkData, inputNode: ViewNode, outputNode: ViewNode, emitter: Emitter) {
        super(emitter);
        this.link = link;
        this.inputNode = inputNode;
        this.outputNode = outputNode;

        this.el = document.createElement('div');
        this.el.style.position = 'absolute';
        this.el.style.zIndex = '-1';

        this.trigger('renderlink', { 
            el: this.el, 
            link: this.link, 
            points: this.getPoints()
        });
    }

    getPoints() {
        const [x1, y1] = this.outputNode.getSocketPosition(this.link.output);
        const [x2, y2] = this.inputNode.getSocketPosition(this.link.input);

        return [x1, y1, x2, y2];
    }

    update() {
        this.trigger('updatelink', { 
            el: this.el, 
            link: this.link, 
            points: this.getPoints()
        });
    }
}