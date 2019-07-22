import 'utils/extensions';
import './Dashboard.less';

import { Button, Card, List, Spin, Tooltip } from 'antd';
import { GraphModalStore } from 'components/Modals/GraphModal/graph-modal-store';
import GraphModalFormController from 'components/Modals/GraphModal/GraphModalForm';
import { MacroModalStore } from 'components/Modals/MacroModal/macro-modal-store';
import MacroModalFormController from 'components/Modals/MacroModal/MacroModalForm';
import { EditorStore } from 'features/Editor/editor-store';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { GraphStore } from 'stores/graph-store';
import { MacroStore } from 'stores/macro-store';

import { isMacro } from 'utils';
import DashboardCard from './DashboardCard';

interface IDashboardProps {
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
@(withRouter as any)
@observer
class DashboardView extends React.Component<
    IDashboardProps & RouteComponentProps<any>
> {
    private modals = {
        graph: this.props.graphModalStore!,
        macro: this.props.macroModalStore!,
    };

    public async componentDidMount() {
        this.props.graphStore!.fetchGraphs();
        this.props.macroStore!.fetchMacros();
    }

    public onAdd = (type: GraphType) => {
        this.modals[type].openModal();
    };

    public onRefresh = async (type: GraphType) => {
        if (type === 'graph') {
            await this.props.graphStore!.fetchGraphs(true);
        } else {
            await this.props.macroStore!.fetchMacros(true);
        }
    };

    public onDelete = async (item: any, type: GraphType) => {
        if (type === 'graph') {
            await this.props.graphStore!.deleteGraph(item);
        } else {
            await this.props.macroStore!.deleteMacro(item);
        }
    };

    public onEdit = (item: any, type: GraphType) => {
        this.modals[type]!.openModal(item, true);
    };

    public onBuild = (item: Graph | Macro) => {
        if (isMacro(item)) {
            this.props.history.push(`editor/macro/${item.id}`);
        } else {
            this.props.history.push(`editor/graph/${item.id}`);
        }
    };

    public onPlay = (item: Graph | Macro, type: GraphType) => {
        this.props.editorStore!.runGraph(item);
    };

    public render() {
        const { graphs, loadingGraphs } = this.props.graphStore!;
        const { macros, loadingMacros } = this.props.macroStore!;

        const combined = [
            {
                key: 'graph' as GraphType,
                name: 'Graphs',
                collection: graphs,
                loading: loadingGraphs,
                message: 'Fetching Graphs...',
            },
            {
                key: 'macro' as GraphType,
                name: 'Macros',
                collection: macros,
                loading: loadingMacros,
                message: 'Fetching Macros...',
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
                                        loading={x.loading}
                                        type={x.key}
                                        onClick={this.onRefresh}
                                    />
                                </div>
                            }
                        >
                            <Spin
                                spinning={x.loading}
                                tip={x.message}
                                delay={500}
                            >
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
                                                onPlay={this.onPlay}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Spin>
                        </Card>
                    </div>
                ))}
                <GraphModalFormController />
                <MacroModalFormController />
            </div>
        );
    }
}

interface IButtonProps {
    onClick: (type: GraphType) => void;
    type: GraphType;
}

class AddButton extends React.Component<IButtonProps> {
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

interface IRefreshButtonProps extends IButtonProps {
    loading: boolean;
}

class RefreshButton extends React.Component<IRefreshButtonProps> {
    public refreshClick = () => {
        this.props.onClick(this.props.type);
    };

    public render() {
        return (
            <Tooltip title="Refresh">
                <Button
                    loading={this.props.loading}
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
