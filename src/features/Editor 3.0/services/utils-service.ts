import { BaseService } from "src/services/base-service";

class UtilsService extends BaseService {

    public getNodeDefinitions = async () : Promise<Array<NodeDefinition>> => {
        try {
            const response = await this.get<Array<NodeDefinition>>("utils/nodes/all");
            return response.data;
        } catch(err) {
            // throw new Error("Error: " + err);
            return Promise.resolve([]);

        }
    }

}

export const utilsService = new UtilsService();