import React from 'react';
import { MenuItem } from 'react-contextmenu';
import { MenuIcon } from '..';
import { trash2 } from 'react-icons-kit/feather/trash2';

type ConnectorMenuType = React.ComponentType<{ onDeleteConnector: () => void }>;
const ConnectorContextMenu : ConnectorMenuType = ({onDeleteConnector}) => 
        <>
            <MenuItem onClick={() => onDeleteConnector()}>
                <MenuIcon icon={trash2} />
                Delete
            </MenuItem>
        </>

export default ConnectorContextMenu;