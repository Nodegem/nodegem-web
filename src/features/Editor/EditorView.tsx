import * as React from "react";
import { observer } from "mobx-react";
import { NodeEditor, EditorImportExport } from "./rete-engine/editor";
import ReactRenderPlugin from './rete-plugins/react-render-plugin/src';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import ReteLinkPlugin from './rete-plugins/rete-link-plugin/src';

import "./EditorView.less";
import { GenericComponent } from "./generic-component";
import { utilsService } from "./services/utils-service";
import FlowGraphHub from "./hubs/graph-hub";
import TerminalHub from "./hubs/terminal-hub";
import { transformGraph } from "./services/data-transform/run-graph";
import { Tabs } from "antd";
import { editorStore } from "./stores/editor-store";

const json : EditorImportExport = 
{
    id: "25edffd4-0713-4583-b111-f31cc12e1321",
    nodes: [
        {
            id: "8d5995d2-0163-4e02-b32b-943391f092fe",
            position: [20, 200],
            namespace: "Core.Control.Start"
        },
        {
            id: "3af4047b-a1d2-414a-8a80-e5b4962778b7",
            position: [300, 200],
            namespace: "Core.Util.Logging.LogWarn"
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

@observer
class EditorView extends React.Component {

    private nodeEditor: NodeEditor;
    private flowGraphHub: FlowGraphHub = new FlowGraphHub();
    private terminalHub: TerminalHub = new TerminalHub();

    public async componentDidMount() {

        this.terminalHub.start();
        this.flowGraphHub.start();

        const container = document.querySelector(".editor") as HTMLElement;
        this.nodeEditor = new NodeEditor(container);

        applyBackground();

        this.nodeEditor.use(ReactRenderPlugin);
        this.nodeEditor.use(ContextMenuPlugin);
        this.nodeEditor.use(ReteLinkPlugin);

        const definitions = await utilsService.getNodeDefinitions()

        definitions.reduce((pV, cV) => {
            pV.push(new GenericComponent(cV));
            return pV;
        }, [] as GenericComponent[])
        .forEach(x => {
            this.nodeEditor.register(x)
        })

        this.nodeEditor.fromJSON(json)
        this.nodeEditor.view.resize();
        window.addEventListener("keydown", this.keyDown);
    }

    private keyDown = (e) => {
        if(e.altKey && e.keyCode === 13) {
            const graphData = transformGraph(this.nodeEditor.toJSON());
            console.log(graphData);

            if(!graphData.links.empty() || !graphData.nodes.empty()) {
                this.flowGraphHub
                    .runGraph(graphData);
            }
        }
    }

    componentWillUnmount() {
        this.terminalHub.disconnect();
        this.flowGraphHub.disconnect();

        this.terminalHub.dispose();
        this.flowGraphHub.dispose();

        window.removeEventListener("keydown", this.keyDown);
    }

    private onTabChange = (key) => {
        console.log(key);
    }

    private onTabAdd = () => {

    }

    private onTabRemove = (key) => {

    }

    public render() {

        const { tabs } = editorStore;

        return (
            <div className="editor-view">
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
            </div>
        )
    }

}

export default EditorView;