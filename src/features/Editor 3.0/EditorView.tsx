import * as React from "react";
import { observer } from "mobx-react";
import { NodeEditor } from "./rete-engine";

@observer
class EditorView extends React.Component {

    private nodeEditor: NodeEditor;

    public componentDidMount() {
        const container = document.querySelector("#editor-container") as HTMLElement;
        this.nodeEditor = new NodeEditor("main-editor", container);
    }

    public render() {
        return (
            <div id="editor-container">Hello World!</div>
        )
    }

}

export { EditorView };