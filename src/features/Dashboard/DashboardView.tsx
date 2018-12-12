import * as React from "react";
import { observer, inject } from "mobx-react";
import './Dashboard.less';
import { DashboardStore, ModalFormType } from "src/stores/dashboard-store";
import { List, Card, Tooltip, Icon, Button, Spin } from "antd";
import 'src/utils/extensions';
import DashboardCard from "./DashboardCard";
import { withRouter, RouteComponentProps } from "react-router";
import { EditorStore } from "src/stores/editor-store";
import GraphModalForm from "./GraphModalForm";
import { toJS } from "mobx";
import MacroModalForm from "./MacroModalForm";

interface DashboardProps {
    dashboardStore?: DashboardStore,
    editorStore?: EditorStore
}

@inject('dashboardStore', 'editorStore')
@(withRouter as any)
@observer
class DashboardView extends React.Component<DashboardProps & RouteComponentProps<any>> {

    async componentDidMount() {
        await this.props.dashboardStore!.fetchGraphs();
    }

    onAdd = type => {
        this.props.dashboardStore!.openModal(type);
    }

    onDelete = async (item: Graph, type) => {
        await this.props.dashboardStore!.deleteGraph(item);
    }

    onEdit = (item: Graph, type) => {
        this.props.dashboardStore!.openModal(type, true, item);
    }

    onBuild = (item: Graph, type) => {
        this.props.editorStore!.setGraph(item);
        this.props.history.push(`editor`);
    }

    public render() {

        const { graphs, macros, loadingGraphs, loadingMacros } = this.props.dashboardStore!;

        const combined = [
            {
                key: "graph" as ModalFormType,
                name: "Graphs",
                collection: graphs,
                loading: loadingGraphs
            },
            {
                key: "macro" as ModalFormType,
                name: "Macros",
                collection: macros,
                loading: loadingMacros
            }
        ]

        return (
            <div className="dashboard">
                {
                    combined.map((x, index) => (
                        <div key={index}>
                            <Card title={x.name} extra={<AddButton type={x.key} onClick={this.onAdd} />}>
                                <Spin spinning={x.loading}>
                                    <List
                                        grid={{
                                            gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6
                                        }}
                                        dataSource={x.collection}
                                        renderItem={(item: Graph) => (
                                            <List.Item key={item.id}>
                                                <DashboardCard item={item} type={x.key} onDelete={this.onDelete} onEdit={this.onEdit} onBuild={this.onBuild} />
                                            </List.Item>
                                        )}
                                    />
                                </Spin>
                            </Card>
                        </div>
                    ))
                }
                <GraphModalForm />
                <MacroModalForm />
            </div>
        );
    }
}

interface AddButtonProps {
    onClick: (type: ModalFormType) => void;
    type: ModalFormType
}

class AddButton extends React.Component<AddButtonProps> {
    
    public handleClick = () => {
        this.props.onClick(this.props.type);
    }

    public render() {

        const { type } = this.props;

        return (
            <Button type="primary" onClick={this.handleClick}>{`Add ${type.upperCaseFirst()}`}</Button>
        )
    }

}

export default DashboardView;