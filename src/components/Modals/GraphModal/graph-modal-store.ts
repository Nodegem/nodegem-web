import { action } from 'mobx';
import { graphStore } from 'src/stores';

import ModalFormStore from '../modal-form-store';

class GraphModalStore extends ModalFormStore {
    @action async saveGraph(values: any) {
        this.saving = true;

        if (this.editMode) {
            await graphStore!.updateGraph({
                ...this.data,
                ...values,
            });
        } else {
            await graphStore!.createGraph(values);
        }

        this.saving = false;
    }
}

export default new GraphModalStore();

export { GraphModalStore };
