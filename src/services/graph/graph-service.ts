import { BaseService } from "../base-service";

class GraphService extends BaseService {

    public createGraph = async (data: { name: string, description: string }) : Promise<Graph> => {
        const response = await this.postWithCredentials<Graph>("graph/create", data);
        return response.data || {};
    }

    public updateGraph = async (data: GraphEditorData) : Promise<Graph> => {
        const response = await this.postWithCredentials<Graph>(`graph/update/{${data.id}}`, data);
        return response.data || {};
    }

    public editGraph = async (data: GraphEditorData) : Promise<Graph> => {
        const response = await this.postWithCredentials<Graph>(`graph/edit/${data.id}`, data);
        return response.data || {};
    }

    public async getAllGraphs() : Promise<Array<Graph>> {
        const response = await this.getWithCredentials<Array<Graph>>("graph/all");
        return response.data || [];
    }

    public getGraph = async (id: string) : Promise<GraphEditorData> => {
        const response = await this.getWithCredentials<GraphEditorData>(`graph/${id}`);
        return response.data || {};
    }

    public deleteGraph = async (id: string) : Promise<void> => {
        await this.deleteWithCredentials(`graph/${id}`);
    }

}

export const graphService = new GraphService();