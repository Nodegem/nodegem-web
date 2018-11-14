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
    return createReactElement(el, nodeComponent, { ...component.props, node, editor, bindSocket, bindControl });
} 

function createControl(editor, { el, control }) {
    const controlComponent = control.reactComponent;
    const props = { ...control.props, getData: control.getData.bind(control), putData: control.putData.bind(control) };
    return createReactElement(el, controlComponent, props);
}

const update = (node) => {
    if(node.reactContext) {
        node.reactContext.forceUpdate();
    }
}

function install(editor: NodeEditor, params: any) {

    editor.on("rendernode", ({ el, node, component, bindSocket, bindControl }) => {
        node.reactContext = createNode(editor, { el, node, component, bindSocket, bindControl });
    });

    editor.on("rendercontrol", ({ el, control }) => {
        control.reactContext = createControl(editor, { el, control });
    });

    editor.on('connectioncreated connectionremoved', connection => {
        update(connection.output.node);
        update(connection.input.node);
    });

    editor.on('nodeselected', () => {
        editor.nodes.map(update);
    });
}

export default {
    name: "react-render",
    install,
    NodeView,
    SocketView
}