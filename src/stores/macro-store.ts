<<<<<<< HEAD
import { observable, action, runInAction } from 'mobx';
import { ignore } from 'mobx-sync';
import { IDisposableStore, userStore } from '.';
import { MacroService } from 'src/services/macro';

class MacroStore implements IDisposableStore {
=======
import { observable, action, runInAction } from "mobx";
import { ignore } from "mobx-sync";
import { IDisposableStore } from ".";

class MacroStore implements IDisposableStore {

>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
    @observable macros: Array<Macro> = [];

    @ignore
    @observable
    loadingMacros: boolean = false;
<<<<<<< HEAD

    @action
    async fetchMacros(force: boolean = false) {
        if (!force && this.macros && !this.macros.empty()) {
            return;
        }

        this.loadingMacros = true;
        try {
            const { id } = userStore!.user!;
            const macros = await MacroService.getAll(id);
            runInAction(() => {
                this.macros = macros;
            });
        } catch (e) {
=======
    
    @action 
    async fetchMacros() {
        this.loadingMacros = true;
        try {
            const macros = [];
            runInAction(() => {
                this.macros = macros
            })
        } catch(e) {
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingMacros = false;
<<<<<<< HEAD
            });
        }
    }

    @action
    async createMacro(macro: CreateMacro) {
        this.loadingMacros = true;
        try {
            const { id } = userStore.user!;
            const newGraph = await MacroService.create({
                ...macro,
                userId: id,
            });
            runInAction(() => {
                this.macros.push(newGraph);
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingMacros = false;
            });
        }
    }

    @action
    async updateMacro(macro: Macro) {
        this.loadingMacros = true;
        try {
            const { id } = userStore.user!;
            const updatedMacro = await MacroService.update({
                ...macro,
                userId: id,
            });
            runInAction(() => {
                const index = this.macros.findIndex(x => x.id === macro.id);
                if (index >= 0) {
                    this.macros[index] = updatedMacro!;
                }
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingMacros = false;
            });
        }
    }

    @action async deleteMacro(macro: Macro) {
        this.loadingMacros = true;
        try {
            await MacroService.delete(macro.id);
            runInAction(() => {
                this.macros = this.macros.filter(m => m.id !== macro.id);
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingMacros = false;
            });
        }
    }

    getMacroById(macroId: string) {
        if (!macroId) return undefined;
        return this.macros.find(x => x.id === macroId);
    }

    @action dispose() {
        this.macros = [];
    }
=======
            })
        }
    }

    @action dispose() {
        this.macros = [];
    }

>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
}

export default new MacroStore();

<<<<<<< HEAD
export { MacroStore };
=======
export { MacroStore }
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
