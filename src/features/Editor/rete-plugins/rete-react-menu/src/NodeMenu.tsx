import * as React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import './menu.css';
import { NodeEditor } from 'src/features/Editor/rete-engine/editor';
import { GenericComponent } from 'src/features/Editor/generic-component';
import { observer } from 'mobx-react';
import nodeMenuStore from './node-menu-store';

const handleDelete = (e, { editor }: NodeMenuProps) => {

    const { selectedNode } = nodeMenuStore;

    if(selectedNode) {

        const component = editor.getComponent(selectedNode.name) as GenericComponent;
        if(component.nodeDefinition.canBeDeleted) {
            editor.removeNode(selectedNode);    
        }
    }
}

const shouldDisableDelete = ({ editor } : NodeMenuProps) => {

    const { selectedNode } = nodeMenuStore;

    if(selectedNode) {
        return !(editor.getComponent(selectedNode.name) as GenericComponent).nodeDefinition.canBeDeleted
    }

    return false;
}

interface NodeMenuProps {
    editor: NodeEditor
}

export const nodeMenuId = "NodeMenu";
export const NodeMenu = observer((props : NodeMenuProps) => (
    <ContextMenu id={nodeMenuId}>
        <MenuItem data={props} onClick={handleDelete} disabled={shouldDisableDelete(props)}>
            Delete
        </MenuItem>
    </ContextMenu>
))
