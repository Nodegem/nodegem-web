import { action, observable } from 'mobx';
import { ignore } from 'mobx-sync';

abstract class ModalFormStore {
    @ignore
    @observable
    isVisible: boolean = false;

    @ignore
    @observable
    data: any = {};

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
        this.data = data;
        this.editMode = editMode;

        if (Object.keys(data).length > 0) {
            this.onDataLoad();
        }
    }

    closeModal() {
        this.toggleModal(false);
        this.onModalClose();
    }

    onDataLoad() {}

    onModalClose() {}
}

export default ModalFormStore;
