import { NodeView } from './NodeView';
import { SocketView } from './Socket';
import { NodeEditor } from './../../../rete-engine/editor';

function install(editor: NodeEditor, params: any) {

    editor.on("rendernode", ({ el, node, component, bindSocket, bindControl }) => {
        console.log(el, node, component, bindSocket, bindControl);
    });

    editor.on("rendercontrol", ({ el, control }) => {

    });

    editor.on('connectioncreated connectionremoved', connection => {

    });

    editor.on('nodeselected', () => {
        
    });
}

export default {
    name: "react-render",
    install,
    NodeView,
    SocketView
}