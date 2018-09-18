import { Port } from "../Port";
import { PortIOType } from "../types";

import { InputValuePortView, OutputValuePortView } from './Views';
import { InputBox } from "./Input/InputBox";
import { store } from "../../..";
import { computed, action } from "mobx";

abstract class ValuePort<IOType extends PortIOType> extends Port<IOType, "value"> {
    constructor(label: string, key: string) {
        super(label, key);
        this.type = "value";
    }
}
class InputValuePort extends ValuePort<"input"> {

    defaultValue: any;
    inputBox: InputBox;

    @computed
    public get shouldShowInput() : boolean {
        return !this.connected 
            && (!store.linking || (store.linking && store.linking.from.node === this.node) 
                    || (store.linking && store.linking.from.type === "flow")
                    || (store.linking && store.linking.from.ioType === "input"))
    }

    public get value() {
        return !this.connected ? this.inputBox.value : this.defaultValue;
    }

    constructor(label: string, key: string, defaultValue: any) {
        super(label, key);
        this.ioType = "input";
        this.defaultValue = defaultValue;
        this.inputBox = new InputBox(this, defaultValue);
    }
}
class OutputValuePort extends ValuePort<"output"> {

    constructor(label: string, key: string) {
        super(label, key);
        this.ioType = "output";
    }

}

export { InputValuePort, OutputValuePort, InputValuePortView, OutputValuePortView };