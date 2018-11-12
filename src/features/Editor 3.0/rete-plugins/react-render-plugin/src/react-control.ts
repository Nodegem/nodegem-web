import { Control } from "../../../rete-engine/control";
import { Emitter } from "../../../rete-engine/core/emitter";

export class ReactControl extends Control {

    emitter: Emitter;
    public viewComponent: any;

    constructor(emitter, key) {
        super(key);

        this.emitter = emitter;
        this.viewComponent = null;
    }

}