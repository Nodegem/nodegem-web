import { Input } from './input';
import { Output } from './output';

export type LinkImportExport = { };
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

    remove() {
        this.input.removeLink(this);
        this.output.removeLink(this);
    }
}