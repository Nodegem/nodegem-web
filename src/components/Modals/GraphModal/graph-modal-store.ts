import ModalFormStore from '../modal-form-store';
import { action } from 'mobx';
import { graphStore } from 'src/stores';

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
