import { Emitter } from './rete-engine/core/emitter';
import { Control } from "./rete-engine/control";
import { NumControl } from "./ControlViews";

export class GenericControl extends Control {

    reactComponent: any;
    emitter: Emitter;
    props: object;

    constructor(emitter: Emitter, key: string, name: string) {
        super(key);

        this.props = {
            name: name,
            controlKey: key
        };

        this.emitter = emitter;
        this.reactComponent = NumControl;
    }

}