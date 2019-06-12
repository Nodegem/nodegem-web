import { requests } from '../agent';

const MacroService = {
    getAll: (): Promise<Array<Macro>> => requests.get(`/macro/all`),
    delete: (id: string): Promise<void> => requests.del(`/macro/${id}`),
    get: (id: string): Promise<Macro> => requests.get(`/macro/${id}`),
    create: (macro: CreateMacro): Promise<Macro> =>
        requests.post('/macro/create', macro),
    update: (macro: Macro): Promise<Macro> =>
        requests.put(`/macro/update/${macro.id}`, macro),
};

export { MacroService };
