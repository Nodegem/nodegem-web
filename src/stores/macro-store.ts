import { observable, action, runInAction } from 'mobx';
import { ignore } from 'mobx-sync';
import { IDisposableStore, userStore } from '.';
import { MacroService } from 'src/services/macro';

class MacroStore implements IDisposableStore {
    @observable macros: Array<Macro> = [];

    @ignore
    @observable
    loadingMacros: boolean = false;

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
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingMacros = false;
            });
        }
    }

    @action
    async createMacro(macro: CreateMacro): Promise<Macro | undefined> {
        this.loadingMacros = true;
        let newGraph;
        try {
            const { id } = userStore.user!;
            newGraph = await MacroService.create({
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
            return newGraph;
        }
    }

    @action
    async updateMacro(macro: Macro): Promise<Macro | undefined> {
        this.loadingMacros = true;
        let updatedMacro;
        try {
            const { id } = userStore.user!;
            updatedMacro = await MacroService.update({
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
            return updatedMacro;
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
}

export default new MacroStore();

export { MacroStore };
