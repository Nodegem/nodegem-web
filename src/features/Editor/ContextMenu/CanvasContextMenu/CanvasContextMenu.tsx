import React, { PureComponent } from "react";
import { MenuItem, SubMenu } from 'react-contextmenu';
import { Icon } from "react-icons-kit";
import {trash2} from 'react-icons-kit/feather/trash2';
import { MenuIcon } from "..";

export default class CanvasContextMenu extends PureComponent {
    
    public render() {
        return (
            <>
                <div className="node-search" >
                    <input type="text" style={{width: "100%"}} />
                </div>
                <SubMenu title="hello">
                    <MenuItem>Goodbye</MenuItem>
                </SubMenu>
                <MenuItem>
                    <MenuIcon icon={trash2} />
                    Clear Canvas
                </MenuItem>
            </>
        )
    }
    
}