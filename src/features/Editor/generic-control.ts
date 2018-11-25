import { ValueType } from '../../services/graph/value-types';
import { Emitter } from './rete-engine/core/emitter';
import { Control } from "./rete-engine/control";
import { ReteControlView } from './rete-react-controls/ControlViews';

export class GenericControl extends Control {

    reactComponent: any;
    emitter: Emitter;
    props: object;

    constructor(emitter: Emitter, key: string, name: string, defaultValue: any = null, valueType: ValueType) {
        super(key);

        this.props = {
            name: name,
            controlKey: key,
            defaultValue: defaultValue,
            valueType: valueType
        };

        this.emitter = emitter;
        this.reactComponent = ReteControlView;
    }

}