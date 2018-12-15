import * as React from 'react';
import ReactDOM from 'react-dom';
import { NodeEditor } from 'src/features/Editor/rete-engine/editor';
import { Node } from 'src/features/Editor/rete-engine/node';
import { showMenu, hideMenu } from 'react-contextmenu';

import { NodeMenu, nodeMenuId } from './NodeMenu';
import { editorMenuId, EditorMenu } from './EditorMenu';
import nodeMenuStore from './node-menu-store';
import editorMenuStore from './editor-menu-store';

interface MenuProps {
    definitions: Array<NodeDefinition>
}

interface OnContextMenuProps {
    e: React.MouseEvent;
    node?: Node
}

function install(editor: NodeEditor, params: MenuProps) {

    const editorMenuContainer = document.createElement('div');
    editorMenuContainer.className = "editor-context-menu";
    editor.view.container.appendChild(editorMenuContainer);
    ReactDOM.render(<EditorMenu editor={editor} definitions={params.definitions || []} />, editorMenuContainer);

    const nodeMenuContainer = document.createElement('div');
    nodeMenuContainer.className = "node-context-menu";
    editor.view.container.appendChild(nodeMenuContainer);
    ReactDOM.render(<NodeMenu editor={editor} />, nodeMenuContainer);

    editor.bind('hidecontextmenu');

    editor.on('hidecontextmenu', () => {
        editorMenuStore.setTracking(true);
        hideMenu();
    });

    editor.on('mousemove', ({x, y}) => {
        if(editorMenuStore.trackPosition) {
            editorMenuStore.setPosition(x, y);
        }
    })

    editor.on('click contextmenu', ({ container, e }) => {

        const target = e.target;
        if(target && target.className.includes("editor-menu-search")) {
            return;
        }
        
        editor.trigger('hidecontextmenu');
    })

    editor.on('contextmenu', ({e, node} : OnContextMenuProps) => {
        e.preventDefault();
        e.stopPropagation();

        editorMenuStore.setTracking(false);

        const { clientX, clientY } = e;

        if(node) {
            nodeMenuStore.setSelectedNode(node);
            showMenu({ position: { x: clientX, y: clientY }, id: nodeMenuId });
        } else {
            showMenu({ position: { x: clientX, y: clientY }, id: editorMenuId });
        }
    })

}

export default {
    name: 'rete-react-menu',
    install
}