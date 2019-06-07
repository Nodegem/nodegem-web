import { action, observable } from 'mobx';
import { macroStore } from 'src/stores';

import ModalFormStore from '../modal-form-store';
import { ignore } from 'mobx-sync';
import { uuid } from 'lodash-uuid';

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
    flowInputs: Array<Partial<FlowInputFieldDto>> = [];

    @ignore
    @observable
    valueInputs: Array<Partial<ValueInputFieldDto>> = [];

    @ignore
    @observable
    flowOutputs: Array<Partial<FlowOutputFieldDto>> = [];

    @ignore
    @observable
    valueOutputs: Array<Partial<ValueOutputFieldDto>> = [];

    @action async saveMacro(values: any): Promise<Macro | undefined> {
        this.saving = true;
        let macro;

        const newData = { ...values, ...this.createIOObject(values) };

        if (this.editMode) {
            macro = await macroStore!.updateMacro({
                ...this.data,
                ...newData,
            });
        } else {
            macro = await macroStore!.createMacro({
                ...newData,
            });
        }

        this.saving = false;
        return macro;
    }

    private createIOObject(values: any) {
        const { flowInputs, flowOutputs, valueInputs, valueOutputs } = values;
        return {
            flowInputs: Object.keys(flowInputs || {}).map<FlowInputFieldDto>(
                x => ({
                    key: x,
                    label: flowInputs[x].label,
                })
            ),
            valueInputs: Object.keys(valueInputs || {}).map<ValueInputFieldDto>(
                x => ({
                    key: x,
                    label: valueInputs[x].label,
                    defaultValue: valueInputs[x].defaultValue,
                    isOptional: valueInputs[x].isOptional,
                    type: valueInputs[x].type,
                })
            ),
            flowOutputs: Object.keys(flowOutputs || {}).map<FlowOutputFieldDto>(
                x => ({ key: x, label: flowOutputs[x].label })
            ),
            valueOutputs: Object.keys(valueOutputs || {}).map<
                ValueOutputFieldDto
            >(x => ({
                key: x,
                label: valueOutputs[x].label,
                type: valueOutputs[x].type,
            })),
        };
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
        this.flowInputs.push({ key: uuid() });
    }

    @action addNewValueInput() {
        this.valueInputs.push({ key: uuid() });
    }

    @action addNewFlowOutput() {
        this.flowOutputs.push({ key: uuid() });
    }

    @action addNewValueOutput() {
        this.valueOutputs.push({ key: uuid() });
    }

    @action removeFlowInput(id: string) {
        this.flowInputs.splice(
            this.flowInputs.findIndex(x => this.getIndex(x, id)),
            1
        );
    }

    @action removeValueInput(id: string) {
        this.valueInputs.splice(
            this.valueInputs.findIndex(x => this.getIndex(x, id)),
            1
        );
    }

    @action removeFlowOutput(id: string) {
        this.flowOutputs.splice(
            this.flowOutputs.findIndex(x => this.getIndex(x, id)),
            1
        );
    }

    @action removeValueOutput(id: string) {
        this.valueOutputs.splice(
            this.valueOutputs.findIndex(x => this.getIndex(x, id)),
            1
        );
    }

    private getIndex(x: any, id: string): boolean {
        return x.key === id;
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
        this.flowInputs = [...(data.flowInputs || [])];
        this.valueInputs = [...(data.valueInputs || [])];
        this.flowOutputs = [...(data.flowOutputs || [])];
        this.valueOutputs = [...(data.valueOutputs || [])];
    }

    onModalClose() {
        this.resetModal();
    }
}

export default new MacroModalStore();

export { MacroModalStore };
