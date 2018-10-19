import * as React from 'react';
import ReactDOM from 'react-dom';
import { NodeEditor } from '../../../rete-engine/editor';
import NodeView from './NodeView';
import SocketView from './SocketView';

function createReactElement(el, ReactComponent) {
    return ReactDOM.render(<ReactComponent />, el);
}

function createNode(editor, { el, node, component, bindSocket, bindControl }) {
    const nodeComponent = component.component || NodeView;
    return createReactElement(el, nodeComponent);
} 

function createSocket(editor, { el, control }) {
    const socketComponent = control.component || SocketView;
    return createReactElement(el, socketComponent);
}

function install(editor: NodeEditor, params: any) {

    editor.on("rendernode", ({ el, node, component, bindSocket, bindControl }) => {
        node._react = createNode(editor, { el, node, component, bindSocket, bindControl });
    });

    editor.on("rendercontrol", ({ el, control }) => {
        control._react = createSocket(editor, { el, control });
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