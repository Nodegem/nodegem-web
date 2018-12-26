import ModalFormStore from '../modal-form-store';
import { action } from 'mobx';
import { macroStore } from 'src/stores';

class MacroModalStore extends ModalFormStore {
    @action async saveMacro(values: any) {
        this.saving = true;

        if (this.editMode) {
            await macroStore!.updateMacro({
                ...this.data,
                ...values,
            });
        } else {
            await macroStore!.createMacro(values);
        }

        this.saving = false;
    }
}

export default new MacroModalStore();

export { MacroModalStore };
