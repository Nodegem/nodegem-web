import React from 'react';
import { MenuItem } from 'react-contextmenu';
import {trash2} from 'react-icons-kit/feather/trash2';
import { MenuIcon } from '..';

type NodeMenuType = React.ComponentType<{ nodeId: string, onDeleteNode: (nodeId: string) => void }>;
const NodeContextMenu : NodeMenuType = ({ nodeId, onDeleteNode }) => 
        <>
            <MenuItem onClick={() => onDeleteNode(nodeId)}>
                <MenuIcon icon={trash2} />
                Delete
            </MenuItem>
        </>;

export default NodeContextMenu;