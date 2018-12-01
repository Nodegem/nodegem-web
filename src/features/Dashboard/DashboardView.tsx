import * as React from "react";
import { observer } from "mobx-react";
import { graphService } from "src/services/graph/graph-service";
import { Card } from "antd";

interface DashboardViewState {
    graphs: Array<GraphData>;
    macros: Array<any>,
    tabKey: "graph" | "macro";
}

const tabList = [
    {
        key: "graph",
        tab: "Graphs"
    },
    {
        key: "macro",
        tab: "Macros"
    }
]

@observer
class DashboardView extends React.Component<{}, DashboardViewState> {
    state: DashboardViewState = {
        graphs: [],
        macros: [],
        tabKey: "graph"
    };

    public async componentDidMount() {
        this.setState({
            graphs: await graphService.getAllGraphs()
        });
    }

    private onTabChange = (key) => {
        this.setState({
            tabKey: key
        })
    }

    public render() {
        const { graphs, tabKey } = this.state;

        return (
            <div className="dashboard">
                <Card
                    title="Dashboard"
                    style={{ width: "100%" }}
                    tabList={tabList}
                    activeTabKey={tabKey}
                    onTabChange={this.onTabChange}
                >
                    Hello World!
                </Card>
            </div>
        );
    }
}

export default DashboardView;
