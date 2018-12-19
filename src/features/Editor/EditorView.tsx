import './EditorView.less';

import { Spin, Tabs } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { EditorStore } from 'src/features/Editor/editor-store';

import { GenericComponent } from './generic-component';
import FlowGraphHub from './hubs/graph-hub';
import TerminalHub from './hubs/terminal-hub';
import { EditorImportExport, NodeEditor } from './rete-engine/editor';
import ReactRenderPlugin from './rete-plugins/react-render-plugin/src';
import ReteLinkPlugin from './rete-plugins/rete-link-plugin/src';
import ReteEditorMenu from './rete-plugins/rete-editor-menu/src';
import { transformGraph } from './services/data-transform/run-graph';
import { createNode } from './utils';

const json : EditorImportExport = 
{
    id: "25edffd4-0713-4583-b111-f31cc12e1321",
    nodes: [
        {
            id: "8d5995d2-0163-4e02-b32b-943391f092fe",
            position: [20, 200],
            fullName: "Core.Control.Start"
        },
        {
            id: "3af4047b-a1d2-414a-8a80-e5b4962778b7",
            position: [300, 200],
            fullName: "Core.Util.Logging.LogWarn"
        }
    ],
    links: [
        {
            sourceNode: "8d5995d2-0163-4e02-b32b-943391f092fe",
            sourceKey: "start",
            destinationNode: "3af4047b-a1d2-414a-8a80-e5b4962778b7",
            destinationKey: "in"
        }
    ]
}

const TabPane = Tabs.TabPane;

const applyBackground = () => {
    const areaViewContainer = document.querySelector(".area-view-container") as HTMLDivElement;
    const background = document.createElement('div');
    background.setAttribute("class", "background flow-background");
    areaViewContainer.appendChild(background);
}

interface EditorProps {
    editorStore?: EditorStore
}

@inject('editorStore')
@(withRouter as any)
@observer
class EditorView extends React.Component<EditorProps & RouteComponentProps<any>> {

    private nodeEditor: NodeEditor;
    private flowGraphHub: FlowGraphHub = new FlowGraphHub();
    private terminalHub: TerminalHub = new TerminalHub();

    public async componentDidMount() {

        const { editorStore } = this.props;
        await editorStore!.loadDefinitions();
        
        const { nodeDefinitions } = editorStore!;

        const container = document.querySelector(".editor") as HTMLElement;
        this.nodeEditor = new NodeEditor(container);

        this.nodeEditor.bind("dispose")

        const definitions = nodeDefinitions;
        definitions.reduce((pV, cV) => {
            pV.push(new GenericComponent(cV));
            return pV;
        }, [] as GenericComponent[])
        .forEach(x => {
            this.nodeEditor.register(x)
        })

        await this.terminalHub.start();
        await this.flowGraphHub.start();

        applyBackground();

        this.nodeEditor.fromJSON(json)

        this.nodeEditor.use(ReactRenderPlugin);
        this.nodeEditor.use(ReteLinkPlugin);
        this.nodeEditor.use(ReteEditorMenu, {
            definitions: nodeDefinitions.filter(x => x !== editorStore!.getStartNodeDefinition())
        });

        this.nodeEditor.on('clear', async () => await createNode(this.nodeEditor, editorStore!.getStartNodeDefinition(), { x: 20, y: 20 }))
        this.nodeEditor.on('process', async () => {
            this.runGraph();
        });
    }

    private runGraph = () => {
        const graphData = transformGraph(this.nodeEditor.toJSON());
        if(!graphData.links.empty() || !graphData.nodes.empty()) {
            this.flowGraphHub
                .runGraph(graphData);
        }
    }

    componentWillUnmount() {

        this.nodeEditor.trigger("dispose")

        this.terminalHub.disconnect();
        this.flowGraphHub.disconnect();

        this.terminalHub.dispose();
        this.flowGraphHub.dispose();
    }

    private onTabChange = (key) => {
        console.log(key);
    }

    private onTabAdd = () => {

    }

    private onTabRemove = (key) => {

    }

    public render() {

        const { tabs, loadingDefinitions } = this.props.editorStore!;

        return (
            <div className="editor-view">
                <Spin spinning={loadingDefinitions} size="large">
                    <Tabs
                        type="editable-card"
                        onChange={this.onTabChange}
                    >
                        {
                            Object.keys(tabs).map(x => {
                                const tab = tabs[x];
                                return (
                                    <TabPane
                                        key={x}
                                        tab={tab.title}
                                        closable={tab.closable}
                                    >
                                        <div className="editor" id={`editor-${x}`} />
                                    </TabPane>
                                )
                            }) 
                        }
                    </Tabs>
                </Spin>
            </div>
        )
    }

}

export default EditorView;