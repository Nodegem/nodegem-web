import { action, observable } from 'mobx';
import { macroStore } from 'src/stores';

import { uuid } from 'lodash-uuid';
import { ignore } from 'mobx-sync';
import ModalFormStore from '../modal-form-store';

class MacroModalStore extends ModalFormStore {
    @ignore
    @observable
    public parentKey: string | string[] | undefined;

    @ignore
    @observable
    public inputKey: string | string[] | undefined;

    @ignore
    @observable
    public outputKey: string | string[] | undefined;

    @ignore
    @observable
    public flowInputs: Array<Partial<FlowInputFieldDto>> = [];

    @ignore
    @observable
    public valueInputs: Array<Partial<ValueInputFieldDto>> = [];

    @ignore
    @observable
    public flowOutputs: Array<Partial<FlowOutputFieldDto>> = [];

    @ignore
    @observable
    public valueOutputs: Array<Partial<ValueOutputFieldDto>> = [];

    @action public async saveMacro(values: any): Promise<Macro | undefined> {
        this.saving = true;
        let macro;

        const newData = { ...values, ...this.createIOObject(values) };

        if (this.editMode) {
            macro = await macroStore!.updateMacro({
                ...this.modalData,
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

    @action public setParentKey(key: string | string[] | undefined) {
        this.parentKey = key;
    }

    @action public setInputKey(key: string | string[] | undefined) {
        this.inputKey = key;
    }

    @action public setOutputKey(key: string | string[] | undefined) {
        this.outputKey = key;
    }

    @action public addNewFlowInput() {
        this.flowInputs.push({ key: uuid() });
    }

    @action public addNewValueInput() {
        this.valueInputs.push({ key: uuid() });
    }

    @action public addNewFlowOutput() {
        this.flowOutputs.push({ key: uuid() });
    }

    @action public addNewValueOutput() {
        this.valueOutputs.push({ key: uuid() });
    }

    @action public removeFlowInput(id: string) {
        this.flowInputs.splice(
            this.flowInputs.findIndex(x => this.getIndex(x, id)),
            1
        );
    }

    @action public removeValueInput(id: string) {
        this.valueInputs.splice(
            this.valueInputs.findIndex(x => this.getIndex(x, id)),
            1
        );
    }

    @action public removeFlowOutput(id: string) {
        this.flowOutputs.splice(
            this.flowOutputs.findIndex(x => this.getIndex(x, id)),
            1
        );
    }

    @action public removeValueOutput(id: string) {
        this.valueOutputs.splice(
            this.valueOutputs.findIndex(x => this.getIndex(x, id)),
            1
        );
    }

    private getIndex(x: any, id: string): boolean {
        return x.key === id;
    }

    @action public resetModal() {
        this.setInputKey(undefined);
        this.setOutputKey(undefined);
        this.setParentKey(undefined);

        this.flowInputs = [];
        this.flowOutputs = [];
        this.valueInputs = [];
        this.valueOutputs = [];

        this.modalData = {};
    }

    public onDataLoad(data: Macro) {
        this.flowInputs = [...(data.flowInputs || [])];
        this.valueInputs = [...(data.valueInputs || [])];
        this.flowOutputs = [...(data.flowOutputs || [])];
        this.valueOutputs = [...(data.valueOutputs || [])];
    }

    public onModalClose() {
        this.resetModal();
    }
}

export default new MacroModalStore();

export { MacroModalStore };
