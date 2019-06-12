import { action, observable } from 'mobx';
import { graphStore } from 'src/stores';

import ModalFormStore from '../modal-form-store';
import { ignore } from 'mobx-sync';
import { uuid } from 'lodash-uuid';

class GraphModalStore extends ModalFormStore {
    @ignore
    @observable
    constants: Array<Partial<ConstantData>> = [];

    @action async saveGraph(values: any) {
        this.saving = true;

        const newData = { ...values, ...this.createConstantsObject(values) };

        if (this.editMode) {
            await graphStore!.updateGraph({
                ...this.modalData,
                ...newData,
            });
        } else {
            await graphStore!.createGraph(newData);
        }

        this.saving = false;
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

    @action addConstant() {
        this.constants.push({ key: uuid() });
    }

    @action removeConstant(id: string) {
        this.constants = this.constants.filter(x => x.key !== id);
    }

    @action resetModal() {
        this.constants = [];
        this.modalData = {};
    }

    onDataLoad(data: Graph) {
        this.constants = [...(data.constants || [])];
    }

    onModalClose() {
        this.resetModal();
    }
}

export default new GraphModalStore();

export { GraphModalStore };
