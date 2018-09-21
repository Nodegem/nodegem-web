import { Port } from "../Port";
import { PortIOType } from "../types";

import { InputValuePortView, OutputValuePortView } from './Views';
import { InputBox } from "./Input/InputBox";
import { flowEditorStore } from "../../..";
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
            && (!flowEditorStore.linking || (flowEditorStore.linking && flowEditorStore.linking.from.node === this.node) 
                    || (flowEditorStore.linking && flowEditorStore.linking.from.type === "flow")
                    || (flowEditorStore.linking && flowEditorStore.linking.from.ioType === "input"))
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

    public setValue = action((value : any) : void => {
        this.inputBox.value = value;
    })
}
class OutputValuePort extends ValuePort<"output"> {

    constructor(label: string, key: string) {
        super(label, key);
        this.ioType = "output";
    }

}

export { InputValuePort, OutputValuePort, InputValuePortView, OutputValuePortView };