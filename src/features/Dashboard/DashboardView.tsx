import './Dashboard.less';
import 'src/utils/extensions';

import { Button, Card, Icon, List, Spin, Tooltip } from 'antd';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { DashboardStore, ModalFormType } from 'src/features/Dashboard/dashboard-store';
import { EditorStore } from 'src/features/Editor/editor-store';

import DashboardCard from './DashboardCard';
import GraphModalForm from './GraphModalForm';
import MacroModalForm from './MacroModalForm';
import { GraphStore } from 'src/stores/graph-store';
import { MacroStore } from 'src/stores/macro-store';

interface DashboardProps {
    dashboardStore?: DashboardStore,
    editorStore?: EditorStore,
    graphStore?: GraphStore,
    macroStore?: MacroStore
}

@inject('dashboardStore', 'editorStore', 'macroStore', 'graphStore')
@(withRouter as any)
@observer
class DashboardView extends React.Component<DashboardProps & RouteComponentProps<any>> {

    async componentDidMount() {
        await this.props.graphStore!.fetchGraphs();
    }

    onAdd = type => {
        this.props.dashboardStore!.openModal(type);
    }

    onDelete = async (item: Graph, type) => {
        await this.props.graphStore!.deleteGraph(item);
    }

    onEdit = (item: Graph, type) => {
        this.props.dashboardStore!.openModal(type, true, item);
    }

    onBuild = (item: Graph, type) => {
        this.props.editorStore!.setGraph(item.id);
        this.props.history.push(`editor`);
    }

    public render() {

        const { graphs, loadingGraphs } = this.props.graphStore!;
        const { macros, loadingMacros } = this.props.macroStore!;

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