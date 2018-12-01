import { BaseService } from "src/services/base-service";
import { NodeDefinition } from "src/services/graph/node-definitions/types";

class UtilsService extends BaseService {

    public getNodeDefinitions = async () : Promise<Array<NodeDefinition>> => {
        try {
            const response = await this.getWithCredentials<Array<NodeDefinition>>("utils/nodes/all");
            return response.data || [];
        } catch(err) {
            console.error(err);
            return [];
        }
    }

}

export const utilsService = new UtilsService();