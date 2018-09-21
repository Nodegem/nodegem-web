import { BaseService } from "../../../services/base-service";

class GraphService extends BaseService {

    public getNodeDefinitions = async () : Promise<Array<NodeDefinition>> => {
        const response = await this.get<Array<NodeDefinition>>("node");
        return response.data;
    }

    public runGraph = async (data: RunGraphData) : Promise<any> => {
        const response = await this.post("node", data);
        return response.data;
    }

    public newGraph = async (data: SaveGraphData) : Promise<GraphData> => {
        const response = await this.post<GraphData>("graph/new", data);
        return response.data;
    }

    public saveGraph = async (data: SaveGraphData) : Promise<GraphData> => {
        const response = await this.post<GraphData>("graph/save", data);
        return response.data;
    }

    public getGraph = async (id: string) : Promise<GraphData> => {
        const response = await this.get<GraphData>(`graph/${id}`);
        return response.data;
    }

}

export const graphService = new GraphService();