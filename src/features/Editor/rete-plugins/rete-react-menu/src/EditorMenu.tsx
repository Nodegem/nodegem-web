import './editor-menu.less';

import { Divider, Input } from 'antd';
import * as React from 'react';
import { ContextMenu, MenuItem, SubMenu } from 'react-contextmenu';
import { NodeEditor } from 'src/features/Editor/rete-engine/editor';
import { createNode } from 'src/features/Editor/utils';
import { observer } from 'mobx-react';
import editorMenuStore from './editor-menu-store';

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

export const editorMenuId = "EditorMenu";
export const EditorMenu = observer(({ editor, definitions }: EditorMenuProps) => {

    return (
        <ContextMenu id={editorMenuId} className="editor-context-menu">
            <div className="editor-menu-search">
                <Input
                    className="editor-menu-search-input"
                    placeholder="Search..."
                    autoFocus
                />
            </div>
            <SubMenu title={<span>Nodes</span>}>
                {definitions.map((nd, index) => (
                    <MenuItem
                        key={index}
                        data={{ editor: editor, definition: nd }}
                        onClick={buildNode}
                    >
                        {nd.title}
                    </MenuItem>
                ))}
            </SubMenu>
            <Divider />
            <MenuItem data={{ editor, definitions }} onClick={clearGraph}>
                Clear Graph
            </MenuItem>
            <MenuItem data={{ editor, definitions }} onClick={runGraph}>
                Run Graph
            </MenuItem>
        </ContextMenu>
    );
});
