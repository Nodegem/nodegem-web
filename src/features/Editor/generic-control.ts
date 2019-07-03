import { mapToValueType } from 'src/utils/value-type-mapper';

import { Control } from './rete-engine/control';
import { Emitter } from './rete-engine/core/emitter';
import { ReteControlView } from './rete-react-controls/ControlViews';

export class GenericControl extends Control {
    public reactComponent: any;
    public emitter: Emitter;
    public props: object;

    constructor(
        emitter: Emitter,
        key: string,
        name: string,
        defaultValue: any = null,
        valueType: number
    ) {
        super(key);

        this.props = {
            name,
            controlKey: key,
            defaultValue,
            valueType: mapToValueType(valueType),
        };

        this.emitter = emitter;
        this.reactComponent = ReteControlView;
    }
}
