import * as React from "react";
import { observer } from "mobx-react";
import { graphService } from "src/services/graph/graph-service";

interface DashboardViewState {
    graphs: Array<GraphData>
}

@observer
class DashboardView extends React.Component<{}, DashboardViewState> {

    state: DashboardViewState = {
        graphs: []
    }

    public async componentDidMount() {
        this.setState({
            graphs: await graphService.getAllGraphs()
        });
    }

    public render() {

        const { graphs } = this.state;

        return (
            <div className="dashboard">
                <span>Dashboard</span>
            </div>
        );
    }

}

export default DashboardView;