import { observable, action, runInAction } from "mobx";
import { ignore } from "mobx-sync";
import { IDisposableStore } from ".";

class MacroStore implements IDisposableStore {

    @observable macros: Array<Macro> = [];

    @ignore
    @observable
    loadingMacros: boolean = false;
    
    @action 
    async fetchMacros() {
        this.loadingMacros = true;
        try {
            const macros = [];
            runInAction(() => {
                this.macros = macros
            })
        } catch(e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingMacros = false;
            })
        }
    }

    @action dispose() {
        this.macros = [];
    }

}

export default new MacroStore();

export { MacroStore }