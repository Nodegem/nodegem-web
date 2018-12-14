interface Graph {
    id: string,
    name: string,
    isActive: boolean,
    description: string,
    createdOn: Date,
    lastUpdated: Date,
    userId: string
}

interface CreateGraph {
    name: string,
    description: string,
    userId: string
}