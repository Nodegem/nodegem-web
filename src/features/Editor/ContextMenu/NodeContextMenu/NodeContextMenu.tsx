import React from 'react';
import { MenuItem } from 'react-contextmenu';
import {trash2} from 'react-icons-kit/feather/trash2';
import { MenuIcon } from '..';

type NodeMenuType = React.ComponentType<{ onDeleteNode: () => void }>;
const NodeContextMenu : NodeMenuType = ({ onDeleteNode }) => 
        <>
            <MenuItem onClick={() => onDeleteNode()}>
                <MenuIcon icon={trash2} />
                Delete
            </MenuItem>
        </>;

export default NodeContextMenu;