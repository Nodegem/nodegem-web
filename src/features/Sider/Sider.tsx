import React from "react";
import { Menu, Layout, Icon } from "antd";
import { observer } from "mobx-react";
import { appStore } from "../../stores/app-store";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { userStore } from "../../stores/user-store";
import history from "../../utils/history";

import './Sider.scss';

const AntSider = Layout.Sider;

const SettingsIcon = <span><Icon type="setting" /><span>Settings</span></span>;

interface SiderProps {
    width?: number;
}

interface MenuItemData {
    key: string;
    onClick?: (e: React.MouseEvent) => void;
    element: JSX.Element;
}

const themeClick = () => {
    appStore.toggleTheme();
}

const logoutClick = () => {
    history.push("/");
    userStore.logout();
}

const MenuItemData: Array<MenuItemData> = [
    {
        key: "theme",
        onClick: themeClick, 
        element: (
            <>
                <Icon type="bg-colors" />
                Change Theme
            </>
        )
    },
    {
        key: "settings",
        onClick: () => {},
        element: (
            <>
                <Link to='/'>
                    <Icon type="setting" />
                    Profile Settings
                </Link>
            </>
        )
    },
    {
        key: "logout",
        onClick: logoutClick,
        element: (
            <>
                <Icon type="poweroff" />
                Logout
            </>
        )
    }
]

@observer
class Sider extends React.Component<SiderProps & RouteComponentProps<any>> {

    static defaultProps : SiderProps = {
        width: 200
    }

    private handleCollapse = () => {
        appStore.toggleCollapsed();
    }

    private handleClick = ({ item, key, keyPath }) : void => {
        appStore.setSelectedPath(keyPath);
    }

    public render() {

        const { collapsed, theme } = appStore;
        const { width, location } = this.props;

        let selected = location.pathname.replace("/", "");
        if(!selected) { 
            selected = "home";
        }

        return (
            <AntSider
                theme={theme}
                collapsed={collapsed}
                width={width}
                collapsible
                onCollapse={this.handleCollapse}
            >
                <div className="logo-container">
                    <img src="https://via.placeholder.com/50x50" />
                </div>

                <Menu
                    mode="inline"
                    theme={theme}
                    onClick={this.handleClick}
                    defaultSelectedKeys={["project"]}
                    selectedKeys={[selected]}
                >  
                    <Menu.Item key="home">
                        <Link to="/">
                            <Icon type="project" />
                            <span>Home</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="editor">
                        <Link to="/editor">
                            <Icon type="dashboard" />
                            <span>Editor</span>
                        </Link>
                    </Menu.Item>
                    {
                        userStore.isAuthenticated && (
                            <Menu.SubMenu title={SettingsIcon} key="settings">
                                {
                                    MenuItemData.map(i => 
                                        <Menu.Item key={i.key} onClick={i.onClick}>
                                            {i.element}
                                        </Menu.Item>    
                                    )
                                }
                            </Menu.SubMenu>        
                        )
                    }
                </Menu>
            </AntSider>
        );
    }

}

export default withRouter(Sider);