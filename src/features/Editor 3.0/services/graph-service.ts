import { BaseService } from "../../../services/base-service";

class GraphService extends BaseService {

    public newGraph = async (data: SaveGraphData) : Promise<GraphData> => {
        try {
            const response = await this.post<GraphData>("graph/new", data);
            return response.data;
        } catch(err) {
            // throw new Error("Error: " + err);
            return Promise.resolve({} as GraphData);

        }
    }

    public saveGraph = async (data: SaveGraphData) : Promise<GraphData> => {
        try {
            const response = await this.post<GraphData>("graph/save", data);
            return response.data;            
        } catch(err) {
            //  throw new Error("Error: " + err);
            return Promise.resolve({} as GraphData);
        }
    }

    public getGraph = async (id: string) : Promise<GraphData> => {
        try {
            const response = await this.get<GraphData>(`graph/${id}`);
            return response.data;
        } catch(err) {
            return Promise.resolve({} as GraphData);
        }

    }

    public deleteGraph = async (id: string) : Promise<void> => {
        try {
            await this.get(`graph/delete/${id}`);
        } catch (err) {
            return Promise.resolve();
        }
    }

}

export const graphService = new GraphService();