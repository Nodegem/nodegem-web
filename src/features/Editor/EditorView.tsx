import './EditorView.less';

import { Drawer, Icon, notification, Spin } from 'antd';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { GraphModalStore } from 'src/components/Modals/GraphModal/graph-modal-store';
import GraphModalFormController from 'src/components/Modals/GraphModal/GraphModalForm';
import { MacroModalStore } from 'src/components/Modals/MacroModal/macro-modal-store';
import MacroModalFormController from 'src/components/Modals/MacroModal/MacroModalForm';
import { EditorStore } from 'src/features/Editor/editor-store';
import { GraphStore } from 'src/stores/graph-store';
import { MacroStore } from 'src/stores/macro-store';

import { isInput } from '@utils';
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

const editorIndicator = <Icon type="loading" style={{ fontSize: 200 }} />;

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
    IEditorProps & RouteComponentProps<any>
> {
    private nodeEditor: NodeEditor;

    public async componentDidMount() {
        const { editorStore } = this.props;

        const { graphExists } = editorStore!;

        if (!graphExists) {
            this.props.history.push('/');
            notification.error({
                message: 'Unable to load graph',
                description: 'No graph selected.',
            });
            return;
        }

        const { graph, graphType } = editorStore!;

        editorStore!.setLoadingGraph(true);

        const container = document.querySelector('.editor') as HTMLElement;
        this.nodeEditor = new NodeEditor(container);
        editorStore!.setEditor(this.nodeEditor);

        this.centerGraph();

        this.nodeEditor.use(ReactRenderPlugin);
        this.nodeEditor.use(ReteLinkPlugin);
        this.nodeEditor.use(ReteEditorMenu);

        this.nodeEditor.on('refreshTree', async (forceRefresh: boolean) => {
            await editorStore!.loadDefinitions(
                graphType,
                graph.id,
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
    }

    public componentWillUnmount() {
        this.props.editorStore!.disconnect();
        this.props.editorStore!.dispose();
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

        const { graph } = this.props.editorStore!;
        this.renderGraphToScreen(graph);
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
        const { graphExists } = this.props.editorStore!;
        if (graphExists) {
            const { graphType } = this.props.editorStore!;
            const graphData = { ...this.nodeEditor.toJSON() };
            this.props.editorStore!.runGraph(graphData, graphType);
        }
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

        const { graphType } = this.props.editorStore!;
        if (graphType === 'graph') {
            await this.props.editorStore!.saveGraph(nodes, links);
        } else {
            await this.props.editorStore!.saveMacro(nodes, links);
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

    private onSaveMacro = (macro: Macro | undefined) => {
        if (macro) {
            this.props.editorStore!.setGraph(macro.id);

            const { graphId } = this.props.editorStore!;

            if (graphId !== macro.id) {
                this.clearGraph();
            } else {
                this.nodeEditor.trigger('refreshTree');
            }
        }
    };

    private onEditGraph = () => {
        const { graphExists } = this.props.editorStore!;
        if (graphExists) {
            const { graph, graphType } = this.props.editorStore!;

            if (graphType === 'graph') {
                this.props.graphModalStore!.openModal(graph, true);
            } else {
                this.props.macroModalStore!.openModal(graph, true);
            }
        }
    };

    private onDebugModeChanged = (checked: boolean) => {
        this.props.editorStore!.setDebugMode(checked);
    };

    public render() {
        const {
            loadingDefinitions,
            running,
            connected,
            saving,
            logs,
            showLogs,
            graph,
            loadingGraph,
        } = this.props.editorStore!;

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
                    height={400}
                    mask={false}
                    closable={true}
                >
                    <LogView logs={logs} />
                </Drawer>
                <MacroModalFormController onSave={this.onSaveMacro} />
                <GraphModalFormController />
            </div>
        );
    }
}

export default EditorView;
