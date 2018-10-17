import * as React from "react";
import { observer } from "mobx-react";
import { NodeEditor } from "./rete-engine/editor";
import AreaPlugin from 'rete-area-plugin';
import ReactRenderPlugin from './rete-plugins/react-render-plugin/src';
import ContextMenuPlugin from 'rete-context-menu-plugin';
// import { NodeEditor } from "./rete-engine";

const json = 
{
    "id": "main-editor@0.0.1",
    "nodes": {
    }
  }

@observer
class EditorView extends React.Component {

    private nodeEditor: NodeEditor;

    public componentDidMount() {
        const container = document.querySelector("#editor-container") as HTMLElement;
        this.nodeEditor = new NodeEditor("main-editor@0.0.1", container);

        this.nodeEditor.use(AreaPlugin);
        this.nodeEditor.use(ReactRenderPlugin);
        this.nodeEditor.use(ContextMenuPlugin);

        this.nodeEditor.fromJSON(json)

        this.nodeEditor.view.resize();
        AreaPlugin.zoomAt(this.nodeEditor);
    }

    public render() {
        return (
            <div id="editor-container" />
        )
    }

}

export { EditorView };