import './EditorView.less';

import { Spin, notification, Icon, Tooltip, Button } from 'antd';
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
import classNames from 'classnames';
import { toJS } from 'mobx';

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
}

@inject('editorStore')
@(withRouter as any)
@observer
class EditorView extends React.Component<
    EditorProps & RouteComponentProps<any>
> {
    private nodeEditor: NodeEditor;

    public async componentDidMount() {
        const { editorStore } = this.props;
        await editorStore!.loadDefinitions();

        const { nodeDefinitions, currentGraph } = editorStore!;

        if (!currentGraph) {
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
            id: currentGraph!.id,
            links: currentGraph!.links,
            nodes: currentGraph!.nodes.map(
                n =>
                    ({
                        id: n.id,
                        fullName: n.fullName,
                        fieldData: n.fieldData && toJS(n.fieldData.reduce((prev, cur) => {
                            prev[cur.key] = cur.value;
                            return prev;
                        }, {})),
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
        const nodes = json.nodes.map(x => ({
            id: x.id,
            fullName: x.fullName,
            fieldData: x.fieldData && Object.keys(x.fieldData).reduce((prev, cur) => {
                const data = x.fieldData![cur];
                prev.push({ key: data.key, value: data.value })
                return prev;
            }, [] as Array<FieldData>),
            position: { x: x.position[0], y: x.position[1] }
        } as NodeData));

        const links = json.links.map(x => x as LinkData);
        await this.props.editorStore!.saveGraph(
            nodes,
            links);
    }

    private newMacro = () => {

    }

    componentWillUnmount() {
        this.props.editorStore!.dispose();
    }

    public render() {
        const {
            loadingDefinitions,
            running,
            connected,
            saving
        } = this.props.editorStore!;

        const playIconClasses = classNames({
            'control--disabled': running || !connected,
        });
        const stopIconClasses = classNames({
            'control--disabled': !running && connected,
        });

        const playTooltip = running ? "Play" : "Running";
        const playIcon = running ? "loading" : "play-circle";

        return (
            <div className="editor-view">
                <Spin spinning={loadingDefinitions} size="large">
                    <div className="control-panel">
                        <ul className="graph-options">
                            <li>
                                <Button onClick={this.saveGraph} type="primary">
                                    {saving 
                                        ? <Icon type="loading" style={{fontSize: "20px"}} spin/>
                                        : "Save Graph"
                                    }
                                </Button>
                            </li>
                            <li>
                                <Button onClick={this.newMacro} type="primary">New Macro</Button>
                            </li>
                        </ul>
                        <ul className="graph-controls">
                            <li
                                className={playIconClasses}
                                onClick={this.runGraph}
                            >
                                <Tooltip title={playTooltip}>
                                    <Icon
                                        type={playIcon}
                                        theme="twoTone"
                                        style={{ fontSize: '24px' }}
                                        twoToneColor="#52c41a"
                                    />
                                </Tooltip>
                            </li>
                            <li className={stopIconClasses}>
                                <Tooltip title="Stop">
                                    <Icon
                                        type="stop"
                                        theme="twoTone"
                                        style={{ fontSize: '24px' }}
                                        twoToneColor="#eb2f96"
                                    />
                                </Tooltip>
                            </li>
                            <li onClick={this.clearGraph}>
                                <Tooltip title="Clear" placement="bottom">
                                    <Icon
                                        type="delete"
                                        style={{ fontSize: '24px' }}
                                    />
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                    <div className="editor" id={`editor`} />
                </Spin>
            </div>
        );
    }
}

export default EditorView;
