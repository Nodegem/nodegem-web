import shortId from 'shortid';
import { InputValuePort } from "../..";

class InputBox {

    value: any;
    parentPort: InputValuePort;
    elementId: string;

    constructor(parent: InputValuePort) {
        this.parentPort = parent;
        this.elementId = `${parent.elementId}${shortId()}`;
    }

    public handleChange = (e) => {
        console.log(e);
    }

}

export { InputBox };