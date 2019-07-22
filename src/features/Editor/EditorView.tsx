import './EditorView.less';

import { Drawer, Icon, notification, Spin } from 'antd';
import { GraphModalStore } from 'components/Modals/GraphModal/graph-modal-store';
import GraphModalFormController from 'components/Modals/GraphModal/GraphModalForm';
import { MacroModalStore } from 'components/Modals/MacroModal/macro-modal-store';
import MacroModalFormController from 'components/Modals/MacroModal/MacroModalForm';
import { EditorStore } from 'features/Editor/editor-store';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { GraphStore } from 'stores/graph-store';
import { MacroStore } from 'stores/macro-store';

import { GraphService, MacroService } from 'services';
import { getGraphType, isInput } from 'utils';
import { ControlPanelView } from './ControlPanelView';
import { GenericComponent } from './generic-component';
import LogView from './Log/LogView';
import { NodeEditor } from './rete-engine/editor';
import ReactRenderPlugin from './rete-plugins/react-render-plugin/src';
import ReteEditorMenu from './rete-plugins/rete-editor-menu/src';
import ReteLinkPlugin from './rete-plugins/rete-link-plugin/src';

const applyBackground = () => {
    const areaViewContainer = document.querySelector(
        '.area-view-container'
    ) as HTMLDivElement;
    const background = document.createElement('div');
    background.setAttribute('class', 'background flow-background');
    areaViewContainer.appendChild(background);
};

interface IEditorProps {
    editorStore?: EditorStore;
    graphStore?: GraphStore;
    macroStore?: MacroStore;
    macroModalStore?: MacroModalStore;
    graphModalStore?: GraphModalStore;
}

const editorIndicator = (
    <Icon type="loading" style={{ fontSize: 200, margin: -100 }} />
);

@inject(
    'editorStore',
    'graphStore',
    'macroStore',
    'macroModalStore',
    'graphModalStore'
)
@(withRouter as any)
@observer
class EditorView extends React.Component<
    IEditorProps & RouteComponentProps<any>,
    { graphType: GraphType; graph: Graph | Macro }
> {
    private nodeEditor: NodeEditor;
    private timeoutPtr: NodeJS.Timeout;

    constructor(props: IEditorProps & RouteComponentProps<any>) {
        super(props);

        this.state = {
            graph: {} as any,
            graphType: 'graph',
        };
    }

    public async componentDidMount() {
        const { editorStore, match, history } = this.props;

        if (!match.params.graphId) {
            notification.error({
                message: 'Unable to load graph',
                description: 'Graph not found.',
            });
            history.push('/');
        }

        editorStore!.setLoadingGraph(true);
        const g =
            match.params.type === 'graph'
                ? await GraphService.get(match.params.graphId)
                : await MacroService.get(match.params.graphId);
        this.setState({
            graph: g,
            graphType: getGraphType(g),
        });

        const container = document.querySelector('.editor') as HTMLElement;
        this.nodeEditor = new NodeEditor(container);
        editorStore!.setEditor(this.nodeEditor);

        this.centerGraph();

        this.nodeEditor.use(ReactRenderPlugin);
        this.nodeEditor.use(ReteLinkPlugin);
        this.nodeEditor.use(ReteEditorMenu);

        this.nodeEditor.on('refreshTree', async (forceRefresh: boolean) => {
            await editorStore!.loadDefinitions(
                this.state.graphType,
                this.state.graph.id,
                forceRefresh
            );
        });
        this.nodeEditor.on('onTreeRefresh', this.onTreeRefresh);
        this.nodeEditor.on('clear', this.onClearGraph);
        this.nodeEditor.on('process', this.runGraph);

        await editorStore!.initialize();
        applyBackground();

        this.setKeyboardEventListeners();

        this.nodeEditor.trigger('refreshTree', true);

        await editorStore!.graphHub.isBridgeConnected();
        this.timeoutPtr = setInterval(async () => {
            await editorStore!.graphHub.isBridgeConnected();
        }, 2500);
    }

    public componentWillUnmount() {
        this.props.editorStore!.disconnect();
        this.props.editorStore!.dispose();
        clearInterval(this.timeoutPtr);
    }

    private setKeyboardEventListeners() {
        window.addEventListener('keypress', ev => {
            const isInputElement = isInput(ev.target as Element);
            // Space
            if (ev.keyCode === 32 && !isInputElement) {
                ev.preventDefault();
                this.centerGraph();
            }
        });
    }

    private onTreeRefresh = (
        _: IHierarchicalNode<NodeDefinition>,
        definitionList: NodeDefinition[]
    ) => {
        const { editorStore } = this.props;
        editorStore!.setLoadingGraph(true);
        this.nodeEditor.components.clear();
        definitionList
            .reduce(
                (pV, cV) => [...pV, new GenericComponent(toJS(cV))],
                [] as GenericComponent[]
            )
            .forEach(x => {
                this.nodeEditor.register(x);
            });

        this.renderGraphToScreen(this.state.graph);
        editorStore!.setLoadingGraph(false);
    };

    private renderGraphToScreen(graph: Graph | Macro) {
        const jsGraph = toJS(graph);
        this.nodeEditor.fromJSON({
            id: jsGraph!.id,
            links: jsGraph!.links,
            nodes:
                jsGraph!.nodes &&
                jsGraph!.nodes.map(n => ({
                    id: n.id,
                    fullName: n.fullName,
                    fieldData:
                        n.fieldData &&
                        n.fieldData.reduce((prev, cur) => {
                            prev[cur.key] = cur.value;
                            return prev;
                        }, {}),
                    position: [n.position.x, n.position.y],
                    macroId: n.macroId,
                    macroFieldId: n.macroFieldId,
                })),
        });
    }

    private clearGraph = async () => {
        await this.nodeEditor.clear();
    };

    private onClearGraph = () => {
        this.centerGraph();
    };

    private centerGraph = () => {
        const {
            width,
            height,
        } = this.nodeEditor.view.container.getBoundingClientRect();
        this.nodeEditor.view.area.translate(width / 2 - 70, height / 2 - 60);
        this.nodeEditor.view.area.zoom(1);
    };

    private runGraph = () => {
        const graphData = { ...this.nodeEditor.toJSON() };
        this.props.editorStore!.runGraphFromEditor(
            this.state.graph,
            graphData,
            this.state.graphType
        );
    };

    private saveGraph = async () => {
        const json = this.nodeEditor.toJSON();
        const nodes = json.nodes.map(x => ({
            id: x.id,
            fullName: x.fullName,
            fieldData:
                x.fieldData &&
                Object.keys(x.fieldData).reduce(
                    (prev, cur) => {
                        const data = x.fieldData![cur];
                        prev.push({ key: data.key, value: data.value });
                        return prev;
                    },
                    [] as FieldData[]
                ),
            position: { x: x.position[0], y: x.position[1] },
            macroId: x.macroId,
            macroFieldId: x.macroFieldId,
        }));

        const links = json.links.map(x => x as LinkData);

        if (this.state.graphType === 'graph') {
            await this.props.editorStore!.saveGraph(
                this.state.graph,
                nodes,
                links
            );
        } else {
            await this.props.editorStore!.saveMacro(
                this.state.graph as Macro,
                nodes,
                links
            );
        }
    };

    private toggleLogDrawer = () => {
        this.props.editorStore!.toggleLogDrawer();
    };

    private hideLogDrawer = () => {
        this.props.editorStore!.closeLogDrawer();
    };

    private newMacro = () => {
        this.props.macroModalStore!.openModal();
    };

    private onSaveGraph = (graph: Graph | undefined) => {
        if (graph) {
            this.setState({ graph });
        }
    };

    private onSaveMacro = (macro: Macro | undefined) => {
        if (macro) {
            this.props.history.push(`/editor/macro/${macro.id}`);
        }
    };

    private onEditGraph = () => {
        if (this.state.graphType === 'graph') {
            this.props.graphModalStore!.openModal(this.state.graph, true);
        } else {
            this.props.macroModalStore!.openModal(this.state.graph, true);
        }
    };

    private onDebugModeChanged = (checked: boolean) => {
        this.setState(prevState => {
            const graph = { ...prevState.graph };
            graph.isDebugModeEnabled = checked;
            return { graph };
        });
    };

    public render() {
        if (!this.props.editorStore) {
            return null;
        }

        const {
            loadingDefinitions,
            running,
            connected,
            saving,
            logs,
            showLogs,
            loadingGraph,
        } = this.props.editorStore!;

        const { graph } = this.state;

        return (
            <div className="editor-view">
                <Spin
                    className="editor-load"
                    spinning={loadingDefinitions || loadingGraph}
                    delay={500}
                    indicator={editorIndicator}
                >
                    <ControlPanelView
                        running={running}
                        saving={saving}
                        connected={connected}
                        clearGraph={this.clearGraph}
                        saveGraph={this.saveGraph}
                        showLogDrawer={this.toggleLogDrawer}
                        newMacro={this.newMacro}
                        editGraph={this.onEditGraph}
                        runGraph={this.runGraph}
                        debugEnabled={graph.isDebugModeEnabled}
                        onDebugModeChanged={this.onDebugModeChanged}
                    />
                    <div className="editor" id={`editor`} />
                </Spin>
                <Drawer
                    title="Logs"
                    placement="bottom"
                    visible={showLogs}
                    onClose={this.hideLogDrawer}
                    height="40%"
                    mask={false}
                    closable={true}
                    className="log-drawer"
                >
                    <LogView logs={logs} />
                </Drawer>
                <MacroModalFormController onSave={this.onSaveMacro} />
                <GraphModalFormController onSave={this.onSaveGraph} />
            </div>
        );
    }
}

export default EditorView;
