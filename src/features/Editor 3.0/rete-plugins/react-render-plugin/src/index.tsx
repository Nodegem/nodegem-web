import * as React from 'react';
import ReactDOM from 'react-dom';
import { NodeEditor } from '../../../rete-engine/editor';
import NodeView from './NodeView';
import SocketView from './SocketView';

function createReactElement(el: HTMLElement, ReactComponent: any, props: any = {}) {
    return ReactDOM.render(<ReactComponent {...props} />, el);
}

function createNode(editor, { el, node, component, bindSocket, bindControl }) {
    const nodeComponent = component.reactComponent || NodeView;
    return createReactElement(el, nodeComponent, { node, component, bindSocket, bindControl });
} 

function createSocket(editor, { el, control }) {
    console.log(el, control);
    // const socketComponent = control && control.component || SocketView;
    // return createReactElement(el, socketComponent);
}

function install(editor: NodeEditor, params: any) {

    editor.on("rendernode", ({ el, node, component, bindSocket, bindControl }) => {
        node._react = createNode(editor, { el, node, component, bindSocket, bindControl });
    });

    editor.on("rendercontrol", ({ el, control }) => {
        createSocket(editor, { el, control })
        // control._react = createSocket(editor, { el, control });
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