import * as React from 'react';
import { NodeEditor } from 'src/features/Editor/rete-engine/editor';
import { Node } from 'src/features/Editor/rete-engine/node';
import { isDescendant } from 'src/utils';

import { contextMenu } from './context-menu';

interface MenuProps {
    definitions: Array<NodeDefinition>
}

interface OnContextMenuProps {
    e: React.MouseEvent;
    node?: Node
}

function install(editor: NodeEditor, params: MenuProps) {

    // const editorMenuContainer = document.createElement('div');
    // editor.view.container.parentElement!.appendChild(editorMenuContainer);
    // const editorMenuReact = ReactDOM.render(<EditorMenu editor={editor} definitions={params.definitions || []} />, editorMenuContainer);

    // const nodeMenuContainer = document.createElement('div');
    // editor.view.container.parentElement!.appendChild(nodeMenuContainer);
    // const nodeMenuReact = ReactDOM.render(<NodeMenu editor={editor} />, nodeMenuContainer);

    editor.bind('hidecontextmenu');

    editor.on('hidecontextmenu', () => {
    });

    editor.on('mousemove', ({x, y}) => {
    })

    editor.on('click contextmenu', ({ container, e }) => {

        const target = e.target;
        if(target && isDescendant(container, target)) {
            editor.trigger('hidecontextmenu');
        }
    })

    editor.on('contextmenu', ({e, node} : OnContextMenuProps) => {
        e.preventDefault();
        e.stopPropagation();

        const { clientX, clientY } = e;

        if(node) {
            contextMenu.show([{
                label: "hello",
                action: () => console.log("dsad")
            }], { x: 0, y: 0})
        } else {
        }
    })

}

export default {
    name: 'rete-react-menu',
    install
}