import { Link } from './link';
import { Node } from './node';
import { Socket } from './socket';

export class IO {

    public node: Node | null;
    public multipleLinks: boolean;
    public links: Link[];

    public socket: Socket;
    
    key: string;
    name: string;

    constructor(key: string, name: string, socket: Socket, multiConns: boolean) {
	    this.node = null;
        this.multipleLinks = multiConns;
        this.links = [];
	   
        this.key = key;
        this.name = name;
        this.socket = socket;
    }
    
    removeLink(link: Link) {
        this.links.splice(this.links.indexOf(link), 1);
    }

    removeLinks() {
        this.links.map(link => this.removeLink(link));
    }
}