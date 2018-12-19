import './editor-menu.less';

import { Input } from 'antd';
import * as React from 'react';
import { ContextMenu, MenuItem, SubMenu } from 'react-contextmenu';
import { NodeEditor } from 'src/features/Editor/rete-engine/editor';
import { createNode } from 'src/features/Editor/utils';
import { observer } from 'mobx-react';
import editorMenuStore from './editor-menu-store';
import _ from 'lodash';

const buildNode = (e, { editor, definition }: NodeCreateProps) => {
    const { position } = editorMenuStore;
    createNode(editor, definition, { ...position });
};

const clearGraph = (e, { editor }: EditorMenuProps) => {
    editor.clear();
};

const runGraph = (e, { editor }: EditorMenuProps) => {
    editor.trigger("process");
};

interface NodeCreateProps {
    editor: NodeEditor;
    definition: NodeDefinition;
}

interface EditorMenuProps {
    editor: NodeEditor;
    definitions: Array<NodeDefinition>;
}

interface IHierarchicalNode<TItem> {
    children: { [key: string] : IHierarchicalNode<TItem> };
    items: Array<TItem>
}

class HierarchicalNode<TItem> implements IHierarchicalNode<TItem> {

    children: { [key: string] : HierarchicalNode<TItem> } = {};
    items: Array<TItem> = []

    getOrAddChild(key: string) {
        let node: HierarchicalNode<TItem>;
        if(!this.children[key]) {
            node = this.children[key] = new HierarchicalNode<TItem>();
        } else {
            node = this.children[key];
        }
        return node;
    }

    addObject(nodes: Array<any>, item: TItem) {
        this._addObject(nodes, 0, item);
    }

    private _addObject(nodes: Array<any>, index: number, item: TItem) {
        if (index >= nodes.length) {
            this.items.push(item);
        } else {
            this.getOrAddChild(nodes[index])!._addObject(nodes, index + 1, item);
        }
    }

}

const definitionToTree = (definitions: Array<NodeDefinition>) => {
    const root = new HierarchicalNode<NodeDefinition>();
    definitions.forEach(x => root.addObject(x.namespace.split('.'), x));
    return root;
}

const renderTree = (children, editor) => (
    Object.keys(children).map(x => {

        const item = children[x];
        const hasChildren = !Object.keys(item.children).empty();

        return (
            <SubMenu key={x} title={<span>{x}</span>} hoverDelay={0}>
                {hasChildren && renderTree(item.children, editor)}
                {item.items.map(i => (
                    <MenuItem 
                        key={i.fullName}
                        data={{ editor: editor, definition: i }}
                        onClick={buildNode}>
                        {i.title}
                    </MenuItem>
                ))}
            </SubMenu>
        )
    })
)

export const editorMenuId = "EditorMenu";
export const EditorMenu = observer(({ editor, definitions }: EditorMenuProps) => {

    const tree = definitionToTree(definitions);

    return (
        <ContextMenu id={editorMenuId} className="editor-context-menu">
            <div className="editor-menu-search">
                <Input
                    className="editor-menu-search-input"
                    placeholder="Search..."
                    autoFocus
                />
            </div>
            {renderTree(tree.children, editor)}
            <MenuItem divider />
            <MenuItem data={{ editor, definitions }} onClick={clearGraph}>
                Clear Graph
            </MenuItem>
            <MenuItem data={{ editor, definitions }} onClick={runGraph}>
                Run Graph
            </MenuItem>
        </ContextMenu>
    );
});
