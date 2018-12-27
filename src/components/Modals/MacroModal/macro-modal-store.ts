import ModalFormStore from '../modal-form-store';
import { action } from 'mobx';
import { macroStore } from 'src/stores';

class MacroModalStore extends ModalFormStore {
    @action async saveMacro(values: any): Promise<Macro | undefined> {
        this.saving = true;
        let macro;
        if (this.editMode) {
            macro = await macroStore!.updateMacro({
                ...this.data,
                ...values,
            });
        } else {
            macro = await macroStore!.createMacro(values);
        }

        this.saving = false;
        return macro;
    }
}

export default new MacroModalStore();

export { MacroModalStore };
