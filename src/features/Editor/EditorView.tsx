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

import { ControlPanelView } from './ControlPanelView';
import { GenericComponent } from './generic-component';
import LogView from './Log/LogView';
import { NodeEditor } from './rete-engine/editor';
import { NodeImportExport } from './rete-engine/node';
import ReactRenderPlugin from './rete-plugins/react-render-plugin/src';
import ReteEditorMenu from './rete-plugins/rete-editor-menu/src';
import ReteLinkPlugin from './rete-plugins/rete-link-plugin/src';
import { createNode } from './utils';

const applyBackground = () => {
    const areaViewContainer = document.querySelector(
        '.area-view-container'
    ) as HTMLDivElement;
    const background = document.createElement('div');
    background.setAttribute('class', 'background flow-background');
    areaViewContainer.appendChild(background);
};

interface EditorProps {
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
    EditorProps & RouteComponentProps<any>
> {
    private nodeEditor: NodeEditor;

    public async componentDidMount() {
        const { editorStore } = this.props;
        await editorStore!.loadDefinitions();

        const { nodeDefinitions, graph, currentGraph } = editorStore!;

        if (!graph) {
            this.props.history.push('/');
            notification.error({
                message: 'Unable to load graph',
                description: 'No graph selected.',
            });
            return;
        }

        const container = document.querySelector('.editor') as HTMLElement;
        this.nodeEditor = new NodeEditor(container);

        const { width, height } = container.getBoundingClientRect();
        this.nodeEditor.view.area.translate(width / 2 - 70, height / 2 - 60);

        if (currentGraph!.type === 'macro') {
        }

        nodeDefinitions
            .reduce(
                (pV, cV) => {
                    pV.push(new GenericComponent(cV));
                    return pV;
                },
                [] as GenericComponent[]
            )
            .forEach(x => {
                this.nodeEditor.register(x);
            });

        await editorStore!.initialize();
        applyBackground();

        this.nodeEditor.fromJSON({
            id: graph!.id,
            links: graph!.links,
            nodes:
                graph.nodes &&
                graph!.nodes.map(
                    n =>
                        ({
                            id: n.id,
                            fullName: n.fullName,
                            fieldData:
                                n.fieldData &&
                                toJS(
                                    n.fieldData.reduce((prev, cur) => {
                                        prev[cur.key] = cur.value;
                                        return prev;
                                    }, {})
                                ),
                            position: [n.position.x, n.position.y],
                        } as NodeImportExport)
                ),
        });

        this.nodeEditor.use(ReactRenderPlugin);
        this.nodeEditor.use(ReteLinkPlugin);
        this.nodeEditor.use(ReteEditorMenu, {
            definitions: nodeDefinitions.filter(
                x => x !== editorStore!.getStartNodeDefinition()
            ),
        });

        this.nodeEditor.on('clear', this.onClearGraph);
        this.nodeEditor.on('process', this.runGraph);
    }

    private clearGraph = async () => {
        await this.nodeEditor.clear();
    };

    private onClearGraph = async () => {
        const startNodeDefinition = this.props.editorStore!.getStartNodeDefinition();
        const {
            width,
            height,
        } = this.nodeEditor.view.container.getBoundingClientRect();
        this.nodeEditor.view.area.translate(width / 2 - 70, height / 2 - 60);
        await createNode(this.nodeEditor, startNodeDefinition, {
            x: 0,
            y: 0,
        });
    };

    private runGraph = () => {
        const { editorStore } = this.props;
        const { graph } = editorStore!;
        const { constants } = graph!;
        const graphData = { ...this.nodeEditor.toJSON(), constants: constants };
        this.props.editorStore!.runGraph(graphData);
    };

    private saveGraph = async () => {
        const json = this.nodeEditor.toJSON();
        const nodes = json.nodes.map(
            x =>
                ({
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
                            [] as Array<FieldData>
                        ),
                    position: { x: x.position[0], y: x.position[1] },
                } as NodeData)
        );

        const links = json.links.map(x => x as LinkData);

        const { type } = this.props.editorStore!.currentGraph!;
        if (type === 'graph') {
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
            this.props.editorStore!.setGraph(macro.id, 'macro');
        }
    };

    private onEditGraph = () => {
        const { currentGraph } = this.props.editorStore!;
        if (currentGraph) {
            const { graph } = this.props.editorStore!;
            const { type } = currentGraph;

            if (type === 'graph') {
                this.props.graphModalStore!.openModal(graph, true);
            } else {
                this.props.macroModalStore!.openModal(graph, true);
            }
        }
    };

    componentWillUnmount() {
        this.props.editorStore!.disconnect();
    }

    public render() {
        const {
            loadingDefinitions,
            running,
            connected,
            saving,
            logs,
            showLogs,
        } = this.props.editorStore!;

        return (
            <div className="editor-view">
                <Spin
                    className="editor-load"
                    spinning={loadingDefinitions}
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
                    closable
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
