import { Input } from './input';
import { Output } from './output';

export interface LinkImportExport {
    sourceNode: string;
    sourceKey: string;
    destinationNode: string;
    destinationKey: string;
}
export class Link {
    public input: Input;
    public output: Output;
    public data: object;

    constructor(output, input) {
        this.output = output;
        this.input = input;
        this.data = {};

        this.input.addLink(this);
    }

    public toJSON(): LinkImportExport {
        return {
            sourceNode: this.output.node!.id,
            sourceKey: this.output.key,
            destinationNode: this.input.node!.id,
            destinationKey: this.input.key,
        };
    }

    public remove() {
        this.input.removeLink(this);
        this.output.removeLink(this);
    }
}
