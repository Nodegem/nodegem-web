import { Control } from './rete-engine/control';
import { Emitter } from './rete-engine/core/emitter';
import { ReteControlView } from './rete-react-controls/ControlViews';
import { mapToValueType } from 'src/utils/value-type-mapper';

export class GenericControl extends Control {

    reactComponent: any;
    emitter: Emitter;
    props: object;

    constructor(emitter: Emitter, key: string, name: string, defaultValue: any = null, valueType: number) {
        super(key);

        this.props = {
            name: name,
            controlKey: key,
            defaultValue: defaultValue,
            valueType: mapToValueType(valueType)
        };

        this.emitter = emitter;
        this.reactComponent = ReteControlView;
    }

}