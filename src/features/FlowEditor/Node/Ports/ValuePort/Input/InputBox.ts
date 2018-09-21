import shortId from 'shortid';
import { InputValuePort } from "../..";
import { observable } from 'mobx';
import { ChangeEvent } from 'react';

class InputBox {

    @observable
    value: any;

    type: string;
    
    parentPort: InputValuePort;
    elementId: string;

    constructor(parent: InputValuePort, defaultValue: any) {
        this.parentPort = parent;
        this.elementId = `${parent.portId}-input-${shortId()}`;
        this.value = defaultValue;

        if(typeof(defaultValue) === "number") {
            this.type = "number";
        } else {
            this.type = "text";
            this.value = "";
        }
    }

    public handleChange = (e: ChangeEvent) => {
        if(!e.target) return;
        this.value = (e.target as any).value;
    }

}

export { InputBox };