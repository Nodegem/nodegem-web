import { requests } from '../agent';

const GraphService = {
    getAll: (): Promise<Array<Graph>> => requests.get(`/graph/all`),
    delete: (id: string): Promise<void> => requests.del(`/graph/${id}`),
    get: (id: string): Promise<Graph> => requests.get(`/graph/${id}`),
    create: (graph: CreateGraph): Promise<Graph> =>
        requests.post('/graph/create', graph),
    update: (graph: Graph): Promise<Graph> =>
        requests.put(`/graph/update`, graph),
};

export { GraphService };
