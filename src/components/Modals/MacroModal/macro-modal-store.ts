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
    flowInputs: Array<any> = [];

    @ignore
    @observable
    valueInputs: Array<any> = [];

    @ignore
    @observable
    flowOutputs: Array<any> = [];

    @ignore
    @observable
    valueOutputs: Array<any> = [];

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

    @action addNewFlowInput() {
        this.flowInputs.push({});
    }

    @action addNewValueInput() {
        this.valueInputs.push({});
    }

    @action addNewFlowOutput() {
        this.flowOutputs.push({});
    }

    @action addNewValueOutput() {
        this.valueOutputs.push({});
    }

    @action resetModal() {
        this.setInputKey(undefined);
        this.setOutputKey(undefined);
        this.setParentKey(undefined);

        this.flowInputs = [];
        this.flowOutputs = [];
        this.valueInputs = [];
        this.valueOutputs = [];

        this.data = {};
    }

    onDataLoad() {
        this.flowInputs = this.data.flowInputs || [];
        this.valueInputs = this.data.valueInputs || [];
        this.flowOutputs = this.data.flowOutputs || [];
        this.valueOutputs = this.data.valueOutputs || [];
    }

    onModalClose() {
        this.resetModal();
    }
}

export default new MacroModalStore();

export { MacroModalStore };
