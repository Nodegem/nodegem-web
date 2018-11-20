import * as React from "react";
import { observer } from "mobx-react";
import { NodeEditor, EditorImportExport } from "./rete-engine/editor";
import ReactRenderPlugin from './rete-plugins/react-render-plugin/src';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import ReteLinkPlugin from './rete-plugins/rete-link-plugin/src';

import "./EditorView.less";
import { GenericComponent } from "./generic-component";
import { utilsService } from "./services/utils-service";
import { Node } from "./rete-engine/node";
import { LinkImportExport } from "./rete-engine/link";
import { graphService } from "./services/graph-service";
import { startConnectionToGraphHub, run } from "./hubs/graph-hub";
import { startListeningToTerminalHub, subscribeToTerminal } from "./hubs/terminal-hub";
import { transformGraph } from "./services/data-transform/run-graph";

const json : EditorImportExport = 
{
    id: "main-editor@0.0.1",
    nodes: [
        {
            id: "8d5995d2-0163-4e02-b32b-943391f092fe",
            position: [20, 200],
            namespace: "Core.Control.Start"
        },
        {
            id: "3af4047b-a1d2-414a-8a80-e5b4962778b7",
            position: [300, 200],
            namespace: "Core.Util.Log"
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

@observer
class EditorView extends React.Component {

    private nodeEditor: NodeEditor;

    public componentDidMount() {
        startConnectionToGraphHub(() => {});
        startListeningToTerminalHub(() => {});
        subscribeToTerminal(a => console.log(a));

        const container = document.querySelector("#editor-container") as HTMLElement;
        this.nodeEditor = new NodeEditor("main-editor@0.0.1", container);

        const areaViewContainer = document.querySelector(".area-view-container") as HTMLDivElement;
        const background = document.createElement('div');
        background.setAttribute("class", "background flow-background");
        areaViewContainer.appendChild(background);

        this.nodeEditor.use(ReactRenderPlugin);
        this.nodeEditor.use(ContextMenuPlugin);
        this.nodeEditor.use(ReteLinkPlugin);

        utilsService.getNodeDefinitions()
            .then(definitions => {
                definitions.reduce((pV, cV) => {
                    pV.push(new GenericComponent(cV));
                    return pV;
                }, [] as GenericComponent[])
                .map(x => {
                    this.nodeEditor.register(x)
                })
        
                this.nodeEditor.fromJSON(json)
            });

        this.nodeEditor.view.resize();

        window.addEventListener("keydown", e => {
            if(e.altKey && e.keyCode == 13) {
                const graphData = this.nodeEditor.toJSON();
                run(transformGraph("d4a88dda-bc6a-4d14-992a-3aa1e199b92c", graphData.nodes, graphData.links));
            }
        });
        // AreaPlugin.zoomAt(this.nodeEditor);
    }

    public render() {
        return (
            <div id="editor-container" />
        )
    }

}

export { EditorView };