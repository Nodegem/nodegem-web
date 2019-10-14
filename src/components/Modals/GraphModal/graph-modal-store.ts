import { action, observable } from 'mobx';
import { graphStore } from 'stores';

import { uuid } from 'lodash-uuid';

import ModalFormStore from '../modal-form-store';

class GraphModalStore extends ModalFormStore {
    @observable
    public constants: Array<Partial<ConstantData>> = [];

    @observable
    public recurringOptions: Partial<RecurringOptions> = {};

    @observable
    public isActive: boolean = true;

    @action public async saveGraph(values: any) {
        this.saving = true;
        let graph: Graph | undefined;

        const newData = {
            ...values,
            ...this.createConstantsObject(values),
            isActive: this.isActive,
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

    @action
    public toggleActive = () => {
        this.isActive = !this.isActive;
    };

    public onDataLoad(data: Graph) {
        this.isActive = data.isActive || true;
        this.constants = [...(data.constants || [])];
        this.recurringOptions = { ...data.recurringOptions };
    }

    public onModalClose() {
        this.resetModal();
    }
}

export default new GraphModalStore();

export { GraphModalStore };
