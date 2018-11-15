import * as React from "react";
import { observer } from "mobx-react";
import { NodeEditor } from "./rete-engine/editor";
import AreaPlugin from 'rete-area-plugin';
import ReactRenderPlugin from './rete-plugins/react-render-plugin/src';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import ReteLinkPlugin from './rete-plugins/rete-link-plugin/src';
import { Output } from "./rete-engine/output";
import { Input } from "./rete-engine/input";
import { Socket } from "./rete-engine/socket";
import { Component } from "./rete-engine/component";
import { Control } from "./rete-engine/control";

import "./EditorView.less";
import { GenericComponent } from "./generic-component";
import { utilsService } from "./services/utils-service";
import { Node } from "./rete-engine/node";

const json = 
{
    "id": "main-editor@0.0.1",
    "nodes": {
        "23e83110b-b1ce-4f93-8fdb-cc61eecb7022": {
            "id": "23e83110b-b1ce-4f93-8fdb-cc61eecb7022",
            "position": [300, 200],
            "inputs": {
                "in": {
                    "connections": [{
                        "node": "21f1d466-c6c0-417a-8238-3fc9371af63e",
                        "output": "start"
                    }]
                }
            },
            "name": "Core.Util.Log"
        },
        "21f1d466-c6c0-417a-8238-3fc9371af63e": {
            "id": "21f1d466-c6c0-417a-8238-3fc9371af63e",
            "position": [20, 200],
            "outputs": {
                "start": {
                    "connections": [{
                        "node": "23e83110b-b1ce-4f93-8fdb-cc61eecb7022",
                        "input": "in"
                    }]
                }
            },
            "name": "Core.Control.Start"
        }
    }
}

const convertEditorJson = (nodes: Node[]) => {
    const links = nodes.map(x => x.getLinks());
    console.log(links);
}

@observer
class EditorView extends React.Component {

    private nodeEditor: NodeEditor;

    public componentDidMount() {
        const container = document.querySelector("#editor-container") as HTMLElement;
        this.nodeEditor = new NodeEditor("main-editor@0.0.1", container);

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

        window.addEventListener("keydown", e => convertEditorJson(this.nodeEditor.nodes));
        // AreaPlugin.zoomAt(this.nodeEditor);
    }

    public render() {
        return (
            <div id="editor-container">
                <div className="background" />
            </div>
        )
    }

}

export { EditorView };