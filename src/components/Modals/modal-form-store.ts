import { action, observable } from 'mobx';
import { ignore } from 'mobx-sync';

abstract class ModalFormStore {
    @ignore
    @observable
    public isVisible: boolean = false;

    @ignore
    @observable
    public modalData: any = {};

    @ignore
    @observable
    public editMode: boolean = false;

    @ignore
    @observable
    public saving: boolean = false;

    @action public toggleModal(visible: boolean) {
        this.isVisible = visible;
    }

    public openModal(data: any = {}, editMode: boolean = false) {
        this.toggleModal(true);
        this.modalData = { ...data };
        this.editMode = editMode;

        if (Object.keys(data).length > 0) {
            this.onDataLoad(data);
        }
    }

    public closeModal() {
        this.toggleModal(false);
        this.onModalClose();
    }

    public onDataLoad(data) {}

    public onModalClose() {}
}

export default ModalFormStore;
