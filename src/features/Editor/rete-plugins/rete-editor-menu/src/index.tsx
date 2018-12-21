import * as React from 'react';
import { NodeEditor } from 'src/features/Editor/rete-engine/editor';
import { Node } from 'src/features/Editor/rete-engine/node';
import { isDescendant } from 'src/utils';

import contextMenu, { MenuContents, SubMenu, MenuItem } from './editor-menu';
import { createNode } from 'src/features/Editor/utils';
import HierarchicalNode from './hierarchical-node';
import { GenericComponent } from 'src/features/Editor/generic-component';

const nodeMenuContents = (
    deleteNodeFunc: Function,
    canDelete: boolean
): MenuContents => ({
    otherItems: [
        {
            label: 'Delete',
            action: deleteNodeFunc,
            disabled: !canDelete,
        },
    ],
});

const definitionToTree = (definitions: Array<NodeDefinition>) => {
    const root = new HierarchicalNode<NodeDefinition>();
    definitions.forEach(x => root.addObject(x.namespace.split('.'), x));
    return root;
};

const convertToItems = (
    children: { [key: string]: HierarchicalNode<NodeDefinition> },
    editor: NodeEditor,
    addNodeFunc: (definition: NodeDefinition) => void
): Array<SubMenu> =>
    Object.keys(children).map(x => {
        const item = children[x] as HierarchicalNode<NodeDefinition>;

        return {
            label: x,
            items: [
                ...(item.children &&
                    convertToItems(item.children, editor, addNodeFunc)),
                ...item.items.map(
                    i =>
                        ({
                            label: i.title,
                            action: () => addNodeFunc(i),
                        } as MenuItem)
                ),
            ],
        } as SubMenu;
    });

const editorMenuContents = (
    definitionTree: HierarchicalNode<NodeDefinition>,
    editor: NodeEditor,
    position: XYPosition
): MenuContents => {
    const addNode = (definition: NodeDefinition) => {
        createNode(editor, definition, { ...position });
    };

    return {
        filterableItems: convertToItems(
            definitionTree.children,
            editor,
            addNode
        ),
        otherItems: [
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

interface MenuProps {
    definitions: Array<NodeDefinition>;
}

interface OnContextMenuProps {
    e: React.MouseEvent;
    node?: Node;
}

function install(editor: NodeEditor, params: MenuProps) {
    const tree = definitionToTree(params.definitions);

    editor.on('contextmenu', ({ e, node }: OnContextMenuProps) => {
        e.preventDefault();
        e.stopPropagation();

        const { clientX, clientY } = e;

        if (node) {
            const deleteNode = () => {
                editor.removeNode(node);
            };

            const canDelete = !(editor.getComponent(
                node.name
            ) as GenericComponent).nodeDefinition.isRequired;

            contextMenu.show(nodeMenuContents(deleteNode, canDelete), {
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
