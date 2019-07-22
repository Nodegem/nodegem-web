import { action, observable } from 'mobx';


abstract class ModalFormStore {
    
    @observable
    public isVisible: boolean = false;

    
    @observable
    public modalData: any = {};

    
    @observable
    public editMode: boolean = false;

    
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
