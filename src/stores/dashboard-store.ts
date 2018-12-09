import { action, observable, runInAction } from "mobx";
import { GraphService } from "src/services";

class DashboardStore {

    @observable loadingGraphs: boolean = false;
    @observable graphs : Array<Graph> = [];

    @observable loadingMacros: boolean = false;
    @observable macros : Array<Macro> = [];

    @action 
    async fetchGraphs() {
        this.loadingGraphs = true;

        try {
            const graphs = await GraphService.getAll();
            runInAction(() => {
                this.graphs = graphs;
            });
        } catch(e) {
            console.log(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            })
        }

    }

    @action 
    async fetchMacros() {
        this.loadingMacros = true;
        try {
            const macros = [];
            runInAction(() => {
                this.macros = macros
            })
        } catch(e) {

        } finally {
            runInAction(() => {
                this.loadingMacros = false;
            })
        }
    }

}

export default new DashboardStore();

export { DashboardStore }