import { Link } from './link';
import { IO } from './io';
import { Input } from './input';
import { Socket } from './socket';

export class Output extends IO {
  
    constructor(key: string, name: string, socket: Socket, multiConns: boolean = true) {
        super(key, name, socket, multiConns);
    }
    
    hasLink() {
        return this.links.length > 0;
    }

    connectTo(input: Input) {
        if (!this.socket.compatibleWith(input.socket))
            throw new Error('Sockets not compatible');
        if (!input.multipleLinks && input.hasLink())
            throw new Error('Input already has one link');
        if (!this.multipleLinks && this.hasLink())
            throw new Error('Output already has one link');

        var link = new Link(this, input);

        this.links.push(link);
        return link;
    }

    connectedTo(input: Input) {
        return this.links.some((item) => {
            return item.input === input;
        });
    }

    toJSON() {
        return {
            links: this.links.map(c => {
                return {
                    node: c!.input!.node!.id,
                    input: c.input.key,
                    data: c.data
                }
            })
        };
    }
}