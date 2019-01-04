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
    flowInputs: Array<FlowInputFieldDto> = [];

    @ignore
    @observable
    valueInputs: Array<ValueInputFieldDto> = [];

    @ignore
    @observable
    flowOutputs: Array<FlowOutputFieldDto> = [];

    @ignore
    @observable
    valueOutputs: Array<ValueOutputFieldDto> = [];

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
        this.flowInputs.push({} as FlowInputFieldDto);
    }

    @action addNewValueInput() {
        this.valueInputs.push({} as ValueInputFieldDto);
    }

    @action addNewFlowOutput() {
        this.flowOutputs.push({} as FlowOutputFieldDto);
    }

    @action addNewValueOutput() {
        this.valueOutputs.push({} as ValueOutputFieldDto);
    }

    @action removeFlowInput(index: number) {
        this.flowInputs.splice(index, 1);
    }

    @action removeValueInput(index: number) {
        this.valueInputs.splice(index, 1);
    }

    @action removeFlowOutput(index: number) {
        this.flowOutputs.splice(index, 1);
    }

    @action removeValueOutput(index: number) {
        this.valueOutputs.splice(index, 1);
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

    onDataLoad(data: Macro) {
        this.flowInputs = [...data.flowInputs] || [];
        this.valueInputs = [...data.valueInputs] || [];
        this.flowOutputs = [...data.flowOutputs] || [];
        this.valueOutputs = [...data.valueOutputs] || [];
    }

    onModalClose() {
        this.resetModal();
    }
}

export default new MacroModalStore();

export { MacroModalStore };
