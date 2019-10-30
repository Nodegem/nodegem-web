import { action, observable, runInAction } from 'mobx';

import { GraphService } from 'services';

import { userStore } from '.';

class GraphStore implements IDisposableStore {
    @observable
    public graphs: Array<Graph> = [];

    @observable
    public loadingGraphs: boolean = false;

    @action
    public async createGraph(graph: CreateGraph) {
        this.loadingGraphs = true;
        let newGraph: Graph | undefined;

        try {
            const { id } = userStore.user!;
            newGraph = await GraphService.create({
                ...graph,
                userId: id,
            });
            runInAction(() => {
                this.graphs.push(newGraph!);
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            });
        }

        return newGraph;
    }

    @action
    public async updateGraph(graph: Graph) {
        this.loadingGraphs = true;
        let updatedGraph: Graph | undefined;
        try {
            const { id } = userStore.user!;
            updatedGraph = await GraphService.update({ ...graph, userId: id });
            runInAction(() => {
                const index = this.graphs.findIndex(x => x.id === graph.id);
                if (index >= 0) {
                    this.graphs[index] = updatedGraph!;
                }
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            });
        }
        return updatedGraph;
    }

    @action
    public async deleteGraph(graph: Graph) {
        this.loadingGraphs = true;

        try {
            await GraphService.delete(graph.id);
            runInAction(() => {
                this.graphs = this.graphs.filter(x => x.id !== graph.id);
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            });
        }
    }

    @action
    public async fetchGraphs(force: boolean = false) {
        this.loadingGraphs = true;

        try {
            const graphs = await GraphService.getAll();
            runInAction(() => {
                this.graphs = graphs as Array<Graph>;
            });
        } catch (e) {
            console.warn(e);
        } finally {
            runInAction(() => {
                this.loadingGraphs = false;
            });
        }
    }

    public getGraphById(graphId: string) {
        return this.graphs.find(x => x.id === graphId);
    }

    @action public dispose() {
        this.graphs = [];
    }
}

export default new GraphStore();

export { GraphStore };
