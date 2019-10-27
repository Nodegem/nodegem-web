import { getGraphType, isGraph, isMacro } from 'utils';

import { Store } from 'overstated';
import { GraphService, MacroService } from 'services';
import { AppStore } from './app-store';

interface IGraphManagerState {
    loadingMacros: boolean;
    loadingGraphs: boolean;
    graphs: (Graph | Macro)[];
}

export class GraphManagerStore extends Store<IGraphManagerState, AppStore> {
    public state: IGraphManagerState = {
        loadingGraphs: false,
        loadingMacros: false,
        graphs: [],
    };

    public get macros(): Macro[] {
        return this.state.graphs.filter(isMacro);
    }

    public get graphs(): Graph[] {
        return this.state.graphs.filter(isGraph);
    }

    public get hasMacros() {
        return this.macros.any();
    }

    public get hasGraphs() {
        return this.graphs.any();
    }

    // public async fetchAll() {
    //     this.fetchGraphs();
    //     this.fetchMacros();
    // }

    // public fetchGraphs = async () => {
    //     return this.fetch('graph', GraphService);
    // };

    // public fetchMacros = async () => {
    //     return this.fetch('macro', MacroService);
    // };

    // public fetch = async (
    //     type: GraphType,
    //     service: { getAll: () => Promise<Graph[] | Macro[]> }
    // ) => {
    //     this.updateLoadingStatus(type, true);
    //     try {
    //         const newMacros = await service.getAll();
    //         const current = type === 'graph' ? this.graphs : this.macros;
    //         this.setState({
    //             graphs: [
    //                 ...this.state.graphs.filter(
    //                     g => !current.any(m => m.id === g.id)
    //                 ),
    //                 ...newMacros,
    //             ],
    //         });
    //     } catch (e) {
    //         this.ctx.toast(`Unable to retrieve ${type}`, 'error');
    //         console.error(e);
    //     } finally {
    //         this.updateLoadingStatus(type, false);
    //     }
    // };

    // public async createMacro(macro: CreateMacro): Promise<Macro | undefined> {
    //     return this.create(macro);
    // }

    // public async createGraph(graph: CreateGraph): Promise<Graph | undefined> {
    //     return this.create(graph);
    // }

    // public create = async (graph: CreateGraph | CreateMacro) => {
    //     const type = getGraphType(graph);
    //     this.updateLoadingStatus(type, true);
    //     let newGraph;
    //     try {
    //         const userId = this.ctx.userStore.user.id;

    //         if (type === 'graph') {
    //             newGraph = await GraphService.create({
    //                 ...(graph as CreateGraph),
    //                 userId,
    //             });
    //         } else {
    //             newGraph = await MacroService.create({
    //                 ...graph,
    //                 userId,
    //             });
    //         }

    //         this.setState({ graphs: [...this.state.graphs, newGraph] });
    //     } catch (e) {
    //         this.ctx.toast(`Unable to create ${type}`, 'error');
    //         console.error(e);
    //     } finally {
    //         this.updateLoadingStatus(type, false);
    //     }
    //     return newGraph;
    // };

    // public async updateGraph(graph: Graph): Promise<Graph | undefined> {
    //     return this.update(graph);
    // }

    // public async updateMacro(macro: Macro): Promise<Macro | undefined> {
    //     return this.update(macro);
    // }

    // public update = async (graph: Graph | Macro) => {
    //     const type = getGraphType(graph);
    //     this.updateLoadingStatus(type, true);
    //     let updated;
    //     try {
    //         const userId = this.ctx.userStore.user.id;
    //         if (type === 'graph') {
    //             updated = await GraphService.update({
    //                 ...graph,
    //                 userId,
    //             });
    //         } else {
    //             updated = await MacroService.update({
    //                 ...(graph as Macro),
    //                 userId,
    //             });
    //         }

    //         const { graphs } = this.state;
    //         graphs.addOrUpdate(updated, x => x.id === updated.id);
    //         this.setState({ graphs: [...graphs] });
    //     } catch (e) {
    //         this.ctx.toast(`Unable to update ${type}`, 'error');
    //         console.error(e);
    //     } finally {
    //         this.updateLoadingStatus(type, false);
    //     }
    //     return updated;
    // };

    public async deleteGraph(graph: Graph) {
        await this.delete(getGraphType(graph), graph.id, GraphService);
    }

    public async deleteMacro(macro: Macro) {
        await this.delete(getGraphType(macro), macro.id, MacroService);
    }

    public delete = async (
        type: GraphType,
        id: string,
        service: { delete: (id: string) => Promise<void> }
    ) => {
        this.updateLoadingStatus(type, true);
        try {
            await service.delete(id);
            this.setState({
                graphs: this.state.graphs.filter(m => m.id !== id),
            });
        } catch (e) {
            this.ctx.toast(`Unable to delete ${type}`, 'error');
            console.error(e);
        } finally {
            this.updateLoadingStatus(type, false);
        }
    };

    public updateLoadingStatus = (type: GraphType, value: boolean) => {
        if (type === 'graph') {
            this.setState({ loadingGraphs: value });
        } else {
            this.setState({ loadingMacros: value });
        }
    };

    public getMacroById(macroId: string) {
        return this.macros.find(x => x.id === macroId);
    }

    public getGraphById(graphId: string) {
        return this.graphs.find(x => x.id === graphId);
    }

    public clear = () => {
        this.setState({ graphs: [] });
    };
}
