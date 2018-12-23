import { BaseHub } from 'src/hubs/base-hub';

const graphHubPath = process.env.REACT_APP_GRAPH_HUB as string;
class GraphHub extends BaseHub {
    constructor() {
        super(graphHubPath);
    }

    public runGraph = async (data: RunGraphData) => {
        await this.invoke('Run', data);
    };
}

export default GraphHub;
