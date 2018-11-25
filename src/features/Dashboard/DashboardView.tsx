import * as React from "react";
import { observer } from "mobx-react";
import { graphService } from "src/services/graph/graph-service";

@observer
class DashboardView extends React.Component {

    async componentDidMount() {
        const graphs = await graphService.getAllGraphs();
        console.log(graphs);
    }

    public render() {

        return (
            <div className="dashboard">
                <span>Dashboard</span>
            </div>
        );
    }

}

export default DashboardView;