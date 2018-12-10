import * as React from "react";
import { observer, inject } from "mobx-react";
import './Dashboard.less';
import { DashboardStore } from "src/stores/dashboard-store";
import { List, Card, Tooltip, Icon, Button, Spin } from "antd";
import 'src/utils/extensions';
import DashboardCard from "./DashboardCard";
import { withRouter, RouteComponentProps } from "react-router";
import { EditorStore } from "src/stores/editor-store";

interface DashboardProps {
    dashboardStore?: DashboardStore,
    editorStore?: EditorStore
}

@inject('dashboardStore', 'editorStore')
@observer
class DashboardView extends React.Component<DashboardProps & RouteComponentProps<any>> {

    async componentDidMount() {
        await this.props.dashboardStore!.fetchGraphs();
    }

    onDelete = (item: Graph) => {
        this.props.dashboardStore!.deleteGraph(item);
    }

    onEdit = (item: Graph) => {

    }

    onBuild = (item: Graph) => {
        this.props.editorStore!.setGraph(item);
        this.props.history.push(`editor`);
    }

    public render() {

        const { graphs, macros, loadingGraphs, loadingMacros } = this.props.dashboardStore!;

        const combined = [
            {
                key: "graph",
                name: "Graphs",
                collection: graphs,
                loading: loadingGraphs
            },
            {
                key: "macro",
                name: "Macros",
                collection: macros,
                loading: loadingMacros
            }
        ]
    
        return (
            <div className="dashboard">
                {
                    combined.map((x, index) => (
                        <Card key={index} title={x.name} extra={<Button type="primary">{`Add ${x.key.upperCaseFirst()}`}</Button>}>
                            <Spin spinning={x.loading}>
                                <List
                                    grid={{
                                        gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6
                                    }}
                                    dataSource={x.collection}
                                    renderItem={(item: Graph) => (
                                        <List.Item key={item.id}>
                                            <DashboardCard item={item} onDelete={this.onDelete} onEdit={this.onEdit} onBuild={this.onBuild} />
                                        </List.Item>
                                    )}
                                />
                            </Spin>
                        </Card>
                    ))
                }
            </div>
        );
    }

}

export default withRouter(DashboardView);