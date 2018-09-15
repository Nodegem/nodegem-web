import { Port } from "../Port";
import { PortIOType } from "../types";
import { Node } from "../../Node";

import { InputValuePortView, OutputValuePortView } from './Views';
import { InputBox } from "./Input/InputBox";
import { store } from "../../..";
import { computed } from "mobx";
import { isNullOrUndefined } from "util";

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
        return !this.hasConnection 
            && (!store.linking || (store.linking && store.linking.from.node === this.node) || (store.linking && store.linking.from.type === "flow"))
    }

    public get hasConnection() : boolean {
        return !!this.port;
    }

    public get value() {
        return !this.hasConnection ? this.inputBox.value : this.defaultValue;
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