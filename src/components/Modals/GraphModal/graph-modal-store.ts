import { action, observable } from 'mobx';
import { graphStore } from 'src/stores';

import { uuid } from 'lodash-uuid';
import { ignore } from 'mobx-sync';
import ModalFormStore from '../modal-form-store';

class GraphModalStore extends ModalFormStore {
    @ignore
    @observable
    public constants: Array<Partial<ConstantData>> = [];

    @ignore
    @observable
    public recurringOptions: Partial<RecurringOptions> = {};

    @action public async saveGraph(values: any) {
        this.saving = true;
        let graph;

        const newData = {
            ...values,
            ...this.createConstantsObject(values),
        };

        if (values.type !== 'recurring') {
            newData.recurringOptions = undefined;
        }

        if (this.editMode) {
            graph = await graphStore!.updateGraph({
                ...this.modalData,
                ...newData,
            });
        } else {
            console.log(newData);
            graph = await graphStore!.createGraph(newData);
        }

        this.saving = false;
        return graph;
    }

    private createConstantsObject(values: any) {
        const { constants } = values;
        return {
            constants: Object.keys(constants || {}).map<ConstantData>(x => ({
                key: x,
                label: constants[x].label,
                isSecret: constants[x].isSecret,
                type: constants[x].type,
                value: constants[x].value,
            })),
        };
    }

    @action public addConstant() {
        this.constants.push({ key: uuid() });
    }

    @action public removeConstant(id: string) {
        this.constants = this.constants.filter(x => x.key !== id);
    }

    @action public resetModal() {
        this.recurringOptions = {};
        this.constants = [];
        this.modalData = {};
    }

    public onDataLoad(data: Graph) {
        this.constants = [...(data.constants || [])];
        this.recurringOptions = { ...data.recurringOptions };
    }

    public onModalClose() {
        this.resetModal();
    }
}

export default new GraphModalStore();

export { GraphModalStore };
