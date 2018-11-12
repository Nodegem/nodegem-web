import * as React from "react";
import { observer } from "mobx-react";
import { NodeEditor } from "./rete-engine/editor";
import AreaPlugin from 'rete-area-plugin';
import ReactRenderPlugin from './rete-plugins/react-render-plugin/src';
import ContextMenuPlugin from 'rete-context-menu-plugin';
import ReteConnectionPlugin from 'rete-connection-plugin';
import { Output } from "./rete-engine/output";
import { Input } from "./rete-engine/input";
import { Socket } from "./rete-engine/socket";
import { Component } from "./rete-engine/component";
import { Control } from "./rete-engine/control";
import { Node } from "./rete-engine/node";
// import { NodeEditor } from "./rete-engine";

import "./EditorView.less";
import { GenericComponent } from "./generic-component";
import { utilsService } from "./services/utils-service";

const json = 
{
    "id": "main-editor@0.0.1",
    "nodes": {
        "2": {
            "id": 2,
            "data": {
              "num": 2
            },
            "inputs": {
              "num": {
              }  
            },
            "outputs": {
              "num": {
              }
            },
            "position": [80, 200],
            "name": "Core.Util.Log"
        }
    }
}

// const sockets = {
//     num: new Socket('Number'),
//     action: new Socket('Action')
// }

// class FieldControl extends Control {

//     component: any;
//     props: any;
//     vueContext: any;

//     constructor(emitter, key, type, readonly) {
//         super(key);
//         this.props = { emitter, ikey: key, type, readonly, change: () => this.onChange() };
//     }

//     setValue(value) {
//         const ctx = this.vueContext || this.props;

//         ctx.value = value;
//     }

//     onChange() {}
// }

// class NumComponent extends Component {

//     CustomFieldControl: any;

//     constructor() {
//         super("Number");
//     }

//     async builder(node: Node) {
//         var flow1 = new Input('test', 'In', sockets.action);
//         var flow2 = new Output('testout', 'Out', sockets.action);
//         var in1 = new Input('num', 'Test', sockets.num);
//         var out1 = new Output('num', "Number", sockets.num);

//         return node.addControl(new FieldControl(this.editor, 'num', 'number', false))
//             .addInput(flow1)
//             .addInput(in1)
//             .addOutput(flow2)
//             .addOutput(out1);
//     }

//     worker(node, inputs, outputs) {
//         outputs['num'] = node.data.num;
//     }
// }

@observer
class EditorView extends React.Component {

    private nodeEditor: NodeEditor;

    public componentDidMount() {
        const container = document.querySelector("#editor-container") as HTMLElement;
        this.nodeEditor = new NodeEditor("main-editor@0.0.1", container);

        this.nodeEditor.use(ReactRenderPlugin);
        // this.nodeEditor.use(AreaPlugin);
        this.nodeEditor.use(ContextMenuPlugin);
        this.nodeEditor.use(ReteConnectionPlugin);

        utilsService.getNodeDefinitions()
            .then(definitions => {
                console.log(definitions);

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