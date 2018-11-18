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

const json : EditorImportExport = 
{
    id: "main-editor@0.0.1",
    nodes: [
        {
            id: "21f1d466-c6c0-417a-8238-3fc9371af63e",
            position: [20, 200],
            namespace: "Core.Control.Start"
        },
        {
            id: "23e83110b-b1ce-4f93-8fdb-cc61eecb7022",
            position: [300, 200],
            namespace: "Core.Util.Log"
        }
    ],
    links: [
        {
            sourceNode: "21f1d466-c6c0-417a-8238-3fc9371af63e",
            sourceKey: "start",
            destinationNode: "23e83110b-b1ce-4f93-8fdb-cc61eecb7022",
            destinationKey: "in"
        }
    ]
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

        // window.addEventListener("keydown", e => console.log(this.nodeEditor.toJSON()));
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