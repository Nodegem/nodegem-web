import { action, observable, runInAction } from 'mobx';

import { MacroService } from 'services';

import { userStore } from '.';

class MacroStore implements IDisposableStore {
    @observable public macros: Array<Macro> = [];

    
    @observable
    public loadingMacros: boolean = false;

    @action
    public async fetchMacros(force: boolean = false) {
        if (!force && this.macros && !this.macros.empty()) {
            return;
        }

        this.loadingMacros = true;
        try {
            const macros = await MacroService.getAll();
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
    public async createMacro(macro: CreateMacro): Promise<Macro | undefined> {
        this.loadingMacros = true;
        let newMacro;
        try {
            const { id } = userStore.user!;
            newMacro = await MacroService.create({
                ...macro,
                userId: id,
            });
            runInAction(() => {
                this.macros.push(newMacro);
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingMacros = false;
            });
        }
        return newMacro;
    }

    @action
    public async updateMacro(macro: Macro): Promise<Macro | undefined> {
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
        }
        return updatedMacro;
    }

    @action public async deleteMacro(macro: Macro) {
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

    public getMacroById(macroId: string) {
        return this.macros.find(x => x.id === macroId);
    }

    @action public dispose() {
        this.macros = [];
    }
}

export default new MacroStore();

export { MacroStore };
