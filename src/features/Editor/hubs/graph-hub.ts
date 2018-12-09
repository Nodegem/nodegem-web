import { BaseHub } from 'src/hubs/base-hub';

const flowGraphPath = process.env.REACT_APP_FLOW_HUB as string;
class FlowGraphHub extends BaseHub {

    constructor() {
        super(flowGraphPath);
    }

    public runGraph = (data: RunGraphData) => {
        this.invoke('Run', data);
    }

}

export default FlowGraphHub;