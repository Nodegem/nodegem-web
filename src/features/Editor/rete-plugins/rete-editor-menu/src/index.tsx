import { NodeEditor } from 'features/Editor/rete-engine/editor';
import { Node } from 'features/Editor/rete-engine/node';
import { createNode } from 'features/Editor/utils';
import * as React from 'react';

import contextMenu, { IMenuContents, IMenuItem, ISubMenu } from './editor-menu';

const nodeMenuContents = (deleteNodeFunc: () => void): IMenuContents => ({
    otherItems: [
        {
            label: 'Delete',
            action: deleteNodeFunc,
        },
    ],
});

const convertToItems = (
    children: { [key: string]: IHierarchicalNode<NodeDefinition> },
    editor: NodeEditor,
    addNodeFunc: (definition: NodeDefinition) => void
): Array<ISubMenu> =>
    Object.keys(children).map(x => {
        const item = children[x] as IHierarchicalNode<NodeDefinition>;

        return {
            label: x.replace('_', ' '),
            items: [
                ...(item.children &&
                    convertToItems(item.children, editor, addNodeFunc)),
                ...item.items.map(
                    i =>
                        ({
                            label: i.title,
                            data: i,
                            action: () => addNodeFunc(i),
                        } as IMenuItem)
                ),
            ],
        } as ISubMenu;
    });

const editorMenuContents = (
    definitionTree: IHierarchicalNode<NodeDefinition>,
    editor: NodeEditor,
    position: XYPosition
): IMenuContents => {
    const addNode = (definition: NodeDefinition) => {
        createNode(editor, definition, { ...position });
    };

    return {
        filterableItems:
            definitionTree &&
            convertToItems(definitionTree.children, editor, addNode),
        otherItems: [
            {
                label: 'Refresh Definitions',
                action: () => editor.trigger('refreshTree'),
            },
            {
                label: 'Clear',
                action: () => editor.clear(),
            },
            {
                label: 'Run',
                action: () => editor.trigger('process'),
            },
        ],
    };
};

interface IOnContextMenuProps {
    e: React.MouseEvent;
    node?: Node;
}

function refreshTree(definitions: IHierarchicalNode<NodeDefinition>) {
    tree = definitions;
}

let tree: IHierarchicalNode<NodeDefinition>;

function install(editor: NodeEditor) {
    editor.bind('refreshTree');
    editor.bind('onTreeRefresh');

    editor.on('onTreeRefresh', refreshTree);
    editor.on('contextmenu', ({ e, node }: IOnContextMenuProps) => {
        e.preventDefault();
        e.stopPropagation();

        const { clientX, clientY } = e;

        if (node) {
            const deleteNode = () => {
                editor.removeNode(node);
            };

            contextMenu.show(nodeMenuContents(deleteNode), {
                x: clientX,
                y: clientY,
            });
        } else {
            contextMenu.show(
                editorMenuContents(tree, editor, editor.view.area.mouse),
                {
                    x: clientX,
                    y: clientY,
                }
            );
        }
    });
}

export default {
    name: 'rete-react-menu',
    install,
};
