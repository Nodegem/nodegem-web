import React, { PureComponent } from "react";
import { MenuItem, SubMenu } from 'react-contextmenu';
import {trash2} from 'react-icons-kit/feather/trash2';
import { MenuIcon } from "..";

type CanvasContextProps = {
    clearCanvas: () => void;
}
export default class CanvasContextMenu extends PureComponent<CanvasContextProps> {
    
    public render() {

        const { clearCanvas } = this.props;

        return (
            <>
                <div className="node-search" >
                    <input type="text" style={{width: "100%"}} />
                </div>
                <SubMenu title="hello">
                    <MenuItem>Goodbye</MenuItem>
                </SubMenu>
                <MenuItem onClick={() => clearCanvas()}>
                    <MenuIcon icon={trash2} />
                    Clear Canvas
                </MenuItem>
            </>
        )
    }
    
}