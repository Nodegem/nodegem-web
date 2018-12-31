import { action, observable } from 'mobx';
import { ignore } from 'mobx-sync';
import { ModalFormType } from 'src/features/Dashboard/dashboard-store';

export type ModalFormType = "graph" | "macro";

interface ModalDataOptions {
    open: boolean,
    data: object,
    editMode: boolean
}

type ModalOption = { [key in ModalFormType] : ModalDataOptions };

class DashboardStore {

    @ignore
    @observable 
    modalOptions: ModalOption = { 
        "graph": { editMode: false, open: false, data: {} },
        "macro": { editMode: false, open: false, data: {} }
    };

    @action openModal(type: ModalFormType, editMode: boolean = false, modelData = {}) {
        Object.keys(this.modalOptions).forEach(x => {
            let data = this.modalOptions[x] as ModalDataOptions;
            if(x === type) {
                data.editMode = editMode;
                data.open = true;
                data.data = modelData;
            } else {
                data.open = false;
                data.editMode = false;
            }
        })
    }

    @action closeModal(type: ModalFormType) {
        this.modalOptions[type].open = false;
        this.modalOptions[type].data = {};
    }
}

export default new DashboardStore();

export { DashboardStore }