import { action, observable } from 'mobx';
import { macroStore } from 'src/stores';

import ModalFormStore from '../modal-form-store';
import { ignore } from 'mobx-sync';

class MacroModalStore extends ModalFormStore {
    @ignore
    @observable
    parentKey: string | string[] | undefined;

    @ignore
    @observable
    inputKey: string | string[] | undefined;

    @ignore
    @observable
    outputKey: string | string[] | undefined;

    @ignore
    @observable
    inputCounts = {
        flowId: 0,
        valueId: 0,
    };

    @ignore
    @observable
    outputCounts = {
        flowId: 0,
        valueId: 0,
    };

    @action async saveMacro(values: any): Promise<Macro | undefined> {
        this.saving = true;
        let macro;
        if (this.editMode) {
            macro = await macroStore!.updateMacro({
                ...this.data,
                ...values,
            });
        } else {
            macro = await macroStore!.createMacro(values);
        }

        this.saving = false;
        return macro;
    }

    @action setParentKey(key: string | string[] | undefined) {
        this.parentKey = key;
    }

    @action setInputKey(key: string | string[] | undefined) {
        this.inputKey = key;
    }

    @action setOutputKey(key: string | string[] | undefined) {
        this.outputKey = key;
    }

    @action addNewFlowInput() {}

    @action addNewValueInput() {}

    @action addNewFlowOutput() {}

    @action addNewValueOutput() {}

    @action resetModal() {
        this.setInputKey(undefined);
        this.setOutputKey(undefined);
        this.setParentKey(undefined);

        this.inputCounts = {
            flowId: 0,
            valueId: 0,
        };

        this.outputCounts = {
            flowId: 0,
            valueId: 0,
        };
    }
}

export default new MacroModalStore();

export { MacroModalStore };
