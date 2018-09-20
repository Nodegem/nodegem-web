import * as React from 'react';
import { observer } from 'mobx-react';
import { flowContextStore } from '../store/flow-context-store';
import classNames from 'classnames';

import "./FlowContextMenu.scss";

type MenuOptions = Item | SubMenu | Divider;

interface Menu {
    items: Array<MenuOptions>;
}

interface SubMenu {
    label: string;
    items: Array<MenuOptions>;
}

interface Item {
    label: string;
    action: () => void;
    disabled?: boolean;
}

interface Divider {
    divider: boolean;
}

const onClick = (event: React.MouseEvent, action: () => void) => {
    if(event.button !== 0) return;

    action();
    flowContextStore.hide();
}

type ItemProps = { label: string, disabled?: boolean, action: () => void }
const ItemView = ({ label, disabled, action } : ItemProps) => {
    const classes = classNames({
        "item": true,
        "disabled": disabled
    });
    return (
        <li className={classes} onMouseDown={(e) => onClick(e, action)}><span>{label}</span></li>
    )
}

type SubMenuProps = { label: string, items: Array<MenuOptions> }
const SubMenuView = ({ label, items } : SubMenuProps) => {
    return (
        <li className="submenu"><span>{label}</span></li>
    );
}

const DividerView = ({}) => {
    return (
        <li className="divider"><hr /></li>
    )
}

@observer
class FlowContextMenuView extends React.Component {

    private handleMouseLeave = () => {
        flowContextStore.setTimer();
    }

    private handleMouseEnter = () => {
        flowContextStore.stopTimer();
    }

    public render() {

        const { menu, visible, position } = flowContextStore;
        const [x, y] = position;

        const classes = classNames({
            "context-menu": true,
            "visible": visible,
            "hidden": !visible
        })

        return (
            menu.items.length > 0 && 
                <div className={classes} style={{ position: "absolute", left: x - 4, top: y - 4 }} 
                    onMouseLeave={this.handleMouseLeave} 
                    onMouseEnter={this.handleMouseEnter}>
                    <ul>
                        {
                            menu.items.map((i, index) => {

                                let element : JSX.Element | null;
                                if(isSubMenu(i)) {
                                    element = <SubMenuView {...i} key={index} />
                                } else if(isItem(i)) {
                                    element = <ItemView {...i} key={index} />
                                } else if(isDivider(i)) {
                                    element = <DividerView key={index} />
                                } else {
                                    element = null
                                }

                                return element;
                            })
                        }
                    </ul>
                </div>
        );
    }

}

export default FlowContextMenuView;
export { Menu, SubMenu, Item };

const isSubMenu = (arg: any): arg is SubMenu => {
    return arg.items !== undefined;
}

const isItem = (arg: any): arg is Item => {
    return arg.action !== undefined;
}

const isDivider = (arg: any): arg is Divider => {
    return arg.divider !== undefined;
}