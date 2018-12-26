import './Dashboard.less';
import 'src/utils/extensions';

import { Button, Card, Icon, List, Spin, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { EditorStore } from 'src/features/Editor/editor-store';

import DashboardCard from './DashboardCard';
<<<<<<< HEAD
import { GraphStore } from 'src/stores/graph-store';
import { MacroStore } from 'src/stores/macro-store';
import GraphModalForm from 'src/components/Modals/GraphModal/GraphModalForm';
import MacroModalForm from 'src/components/Modals/MacroModal/MacroModalForm';
import { GraphModalStore } from 'src/components/Modals/GraphModal/graph-modal-store';
import { MacroModalStore } from 'src/components/Modals/MacroModal/macro-modal-store';

interface DashboardProps {
    editorStore?: EditorStore;
    graphStore?: GraphStore;
    graphModalStore?: GraphModalStore;
    macroStore?: MacroStore;
    macroModalStore?: MacroModalStore;
}

@inject(
    'editorStore',
    'macroStore',
    'graphStore',
    'macroModalStore',
    'graphModalStore'
)
=======
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
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
@(withRouter as any)
@observer
class DashboardView extends React.Component<
    DashboardProps & RouteComponentProps<any>
> {
    private modals = {
        graph: this.props.graphModalStore!,
        macro: this.props.macroModalStore!,
    };

    async componentDidMount() {
        await this.props.graphStore!.fetchGraphs();
<<<<<<< HEAD
        await this.props.macroStore!.fetchMacros();
    }

    onAdd = (type: GraphType) => {
        this.modals[type].openModal();
    };

    onRefresh = async (type: GraphType) => {
        if (type === 'graph') {
            await this.props.graphStore!.fetchGraphs(true);
        } else {
            await this.props.macroStore!.fetchMacros(true);
        }
    };

    onDelete = async (item: any, type: GraphType) => {
        if (type === 'graph') {
            await this.props.graphStore!.deleteGraph(item);
        } else {
            await this.props.macroStore!.deleteMacro(item);
        }
    };

    onEdit = (item: any, type: GraphType) => {
        this.modals[type]!.openModal(item, true);
    };

    onBuild = (item: any, type: GraphType) => {
        this.props.editorStore!.setGraph(item.id, type);
        this.props.history.push('editor');
    };

    public render() {
=======
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

>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
        const { graphs, loadingGraphs } = this.props.graphStore!;
        const { macros, loadingMacros } = this.props.macroStore!;

        const combined = [
            {
                key: 'graph' as GraphType,
                name: 'Graphs',
                collection: graphs,
                loading: loadingGraphs,
            },
            {
                key: 'macro' as GraphType,
                name: 'Macros',
                collection: macros,
                loading: loadingMacros,
            },
        ];

        return (
            <div className="dashboard">
                {combined.map((x, index) => (
                    <div key={index}>
                        <Card
                            title={x.name}
                            extra={
                                <div className="additional-actions">
                                    <AddButton
                                        type={x.key}
                                        onClick={this.onAdd}
                                    />
                                    <RefreshButton
                                        type={x.key}
                                        onClick={this.onRefresh}
                                    />
                                </div>
                            }
                        >
                            <Spin spinning={x.loading}>
                                <List
                                    grid={{
                                        gutter: 16,
                                        xs: 1,
                                        sm: 2,
                                        md: 4,
                                        lg: 4,
                                        xl: 6,
                                    }}
                                    dataSource={x.collection}
                                    renderItem={(item: Graph) => (
                                        <List.Item key={item.id}>
                                            <DashboardCard
                                                item={item}
                                                type={x.key}
                                                onDelete={this.onDelete}
                                                onEdit={this.onEdit}
                                                onBuild={this.onBuild}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Spin>
                        </Card>
                    </div>
                ))}
                <GraphModalForm />
                <MacroModalForm />
            </div>
        );
    }
}

interface ButtonProps {
    onClick: (type: GraphType) => void;
    type: GraphType;
}

class AddButton extends React.Component<ButtonProps> {
    public handleClick = () => {
        this.props.onClick(this.props.type);
    };

    public render() {
        return (
            <Tooltip title="Add">
                <Button
                    icon="plus"
                    shape="circle"
                    type="primary"
                    onClick={this.handleClick}
                />
            </Tooltip>
        );
    }
}

class RefreshButton extends React.Component<ButtonProps> {
    public refreshClick = () => {
        this.props.onClick(this.props.type);
    };

    public render() {
        return (
            <Tooltip title="Refresh">
                <Button
                    icon="sync"
                    shape="circle"
                    type="primary"
                    ghost
                    onClick={this.refreshClick}
                />
            </Tooltip>
        );
    }
}

export default DashboardView;
