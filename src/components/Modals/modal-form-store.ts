import { action, observable } from 'mobx';
import { ignore } from 'mobx-sync';

abstract class ModalFormStore {
    @ignore
    @observable
    isVisible: boolean = false;

    @ignore
    @observable
    modalData: any = {};

    @ignore
    @observable
    editMode: boolean = false;

    @ignore
    @observable
    saving: boolean = false;

    @action toggleModal(visible: boolean) {
        this.isVisible = visible;
    }

    openModal(data: any = {}, editMode: boolean = false) {
        this.toggleModal(true);
        this.modalData = { ...data };
        this.editMode = editMode;

        if (Object.keys(data).length > 0) {
            this.onDataLoad(data);
        }
    }

    closeModal() {
        this.toggleModal(false);
        this.onModalClose();
    }

    onDataLoad(data) {}

    onModalClose() {}
}

export default ModalFormStore;
