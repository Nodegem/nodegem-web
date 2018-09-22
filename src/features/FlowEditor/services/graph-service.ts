import { BaseService } from "../../../services/base-service";

class GraphService extends BaseService {

    public getNodeDefinitions = async () : Promise<Array<NodeDefinition>> => {
        try {
            const response = await this.get<Array<NodeDefinition>>("graph/nodes");
            return response.data;
        } catch(err) {
            throw new Error("Error: " + err);
        }
    }

    public runGraph = async (data: RunGraphData) : Promise<any> => {
        try {
            const response = await this.post("graph", data);
            return response.data;
        } catch(err) {
            throw new Error("Error: " + err);
        }
    }

    public newGraph = async (data: SaveGraphData) : Promise<GraphData> => {
        try {
            const response = await this.post<GraphData>("graph/new", data);
            return response.data;
        } catch(err) {
            throw new Error("Error: " + err);
        }
    }

    public saveGraph = async (data: SaveGraphData) : Promise<GraphData> => {
        try {
            const response = await this.post<GraphData>("graph/save", data);
            return response.data;            
        } catch(err) {
             throw new Error("Error: " + err);
        }
    }

    public getGraph = async (id: string) : Promise<GraphData> => {
        try {
            const response = await this.get<GraphData>(`graph/${id}`);
            return response.data;
        } catch(err) {
            throw new Error("Error: " + err);
        }

    }

    public deleteGraph = async (id: string) : Promise<void> => {
        try {
            await this.get(`graph/delete/${id}`);
        } catch (err) {
            throw new Error("Error: " + err)
        }
    }

}

export const graphService = new GraphService();