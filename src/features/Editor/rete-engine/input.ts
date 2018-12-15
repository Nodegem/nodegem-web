import { Control } from './control';
import { IO } from './io';
import { Link } from './link';
import { Socket } from './socket';

export class Input extends IO {
   
    control: Control | null;

    constructor(key: string, name: string, socket: Socket, multiConns: boolean = false) {
        super(key, name, socket, multiConns);
        this.control = null;
    }

    public hasLink() {
        return this.links.length > 0;
    }

    public addLink(link: Link) {
        if (!this.multipleLinks && this.hasLink())
            throw new Error('Multiple links not allowed');
        this.links.push(link);
    }

    public addControl(control: Control) {
        this.control = control;
        control.parent = this;
    }

    public showControl() {
        return !this.hasLink() && this.control !== null;
    }

}