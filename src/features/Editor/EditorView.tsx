import './EditorView.less';

<<<<<<< HEAD
import { Spin, notification, Drawer, Modal } from 'antd';
=======
import { Spin, notification, Icon, Tooltip, Button, Drawer } from 'antd';
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { EditorStore } from 'src/features/Editor/editor-store';

import { GenericComponent } from './generic-component';
import { NodeEditor } from './rete-engine/editor';
import ReactRenderPlugin from './rete-plugins/react-render-plugin/src';
import ReteLinkPlugin from './rete-plugins/rete-link-plugin/src';
import ReteEditorMenu from './rete-plugins/rete-editor-menu/src';
import { createNode } from './utils';
import { NodeImportExport } from './rete-engine/node';
import { toJS } from 'mobx';
import { GraphStore } from 'src/stores/graph-store';
import { MacroStore } from 'src/stores/macro-store';
import LogView from './Log/LogView';
<<<<<<< HEAD
import { ControlPanelView } from './ControlPanelView';
import MacroModalForm from 'src/components/Modals/MacroModal/MacroModalForm';
import { MacroModalStore } from 'src/components/Modals/MacroModal/macro-modal-store';
=======
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d

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
<<<<<<< HEAD
    macroModalStore?: MacroModalStore;
}

@inject('editorStore', 'graphStore', 'macroStore', 'macroModalStore')
=======
}

@inject('editorStore', 'graphStore', 'macroStore')
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
@(withRouter as any)
@observer
class EditorView extends React.Component<
    EditorProps & RouteComponentProps<any>
> {
    private nodeEditor: NodeEditor;

    public async componentDidMount() {
        const { editorStore } = this.props;
        await editorStore!.loadDefinitions();

        const { nodeDefinitions, graph } = editorStore!;

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

        const definitions = nodeDefinitions;
        definitions
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
            nodes: graph!.nodes.map(
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
        this.props.editorStore!.runGraph(this.nodeEditor.toJSON());
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
        await this.props.editorStore!.saveGraph(nodes, links);
    };

    private showLogDrawer = () => {
        this.props.editorStore!.showLogDrawer(true);
    };

    private hideLogDrawer = () => {
        this.props.editorStore!.showLogDrawer(false);
    };

<<<<<<< HEAD
    private newMacro = () => {
        this.props.macroModalStore!.openModal();
    };
=======
    private newMacro = () => {};
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d

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

<<<<<<< HEAD
        return (
            <div className="editor-view">
                <Spin spinning={loadingDefinitions} size="large">
                    <ControlPanelView
                        running={running}
                        saving={saving}
                        connected={connected}
                        clearGraph={this.clearGraph}
                        saveGraph={this.saveGraph}
                        showLogDrawer={this.showLogDrawer}
                        newMacro={this.newMacro}
                        runGraph={this.runGraph}
                    />
                    <div className="editor" id={`editor`} />
                </Spin>
                <Drawer
                    title="Logs"
                    placement="bottom"
                    visible={showLogs}
                    onClose={this.hideLogDrawer}
                    height="35vh"
                    mask={false}
                    closable
                >
                    <LogView logs={logs} />
                </Drawer>
                <MacroModalForm />
=======
        const controlClasses = classNames({
            control: true,
            'control--disabled': running || !connected,
        });

        const playTooltip = !running ? 'Play' : 'Running';
        const playIcon = running ? 'loading' : 'play-circle';

        return (
            <div className="editor-view">
                <Spin spinning={loadingDefinitions} size="large">
                    <div className="control-panel">
                        <ul className="graph-options">
                            <li>
                                <Button
                                    onClick={this.saveGraph}
                                    size="small"
                                    type="primary"
                                >
                                    {saving ? (
                                        <Icon
                                            type="loading"
                                            style={{ fontSize: '20px' }}
                                            spin
                                        />
                                    ) : (
                                        'Save Graph'
                                    )}
                                </Button>
                            </li>
                            <li>
                                <Button
                                    onClick={this.clearGraph}
                                    size="small"
                                    type="primary"
                                >
                                    Clear Graph
                                </Button>
                            </li>
                            <li>
                                <Button
                                    onClick={this.newMacro}
                                    size="small"
                                    type="primary"
                                >
                                    New Macro
                                </Button>
                            </li>
                        </ul>
                        <ul className="graph-controls">
                            <li
                                className={controlClasses}
                                onClick={this.runGraph}
                            >
                                <Tooltip title={playTooltip}>
                                    <Icon
                                        type={playIcon}
                                        style={{ fontSize: '24px' }}
                                    />
                                </Tooltip>
                            </li>
                            <li onClick={this.showLogDrawer}>
                                <Tooltip title="View Logs" placement="bottom">
                                    <Icon
                                        className={controlClasses}
                                        type="code"
                                        style={{ fontSize: '24px' }}
                                    />
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                    <div className="editor" id={`editor`} />
                </Spin>
                <Drawer
                    onClose={this.hideLogDrawer}
                    title="Logs"
                    placement="bottom"
                    visible={showLogs}
                    closable
                    height="35vh"
                >
                    <LogView logs={logs} />
                </Drawer>
>>>>>>> ad647b46713bf57b870ff9d067c4a7324f21ed3d
            </div>
        );
    }
}

export default EditorView;
