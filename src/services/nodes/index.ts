import { requests } from '../agent';

const NodeService = {
    getAllNodeDefinitions: (
        graphId: string,
        type: GraphType
    ): Promise<IHierarchicalNode<NodeDefinition>> =>
        requests.get(`/nodes/definitions/${type}/${graphId}`),
};

export { NodeService };
