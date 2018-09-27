import React from "react";
import { Menu, Layout, Icon } from "antd";
import { SiderTheme } from "antd/lib/layout/Sider";
import { observer } from "mobx-react";
import { appStore } from "../../stores/app-store";

const AntSider = Layout.Sider;

@observer
export default class Sider extends React.Component {

    handleCollapse = () => {
        appStore.toggleCollapsed();
    }

    handleClick = ({item, key, keyPath}) => {

        if(key === "theme") {
            appStore.toggleTheme();
        }
    }

    public render() {

        const { collapsed, theme } = appStore;

        return (
            <AntSider
                theme={theme}
                collapsed={collapsed}
                collapsible
                onCollapse={this.handleCollapse}
            >
                <Menu
                    mode="inline"
                    onClick={this.handleClick}  
                    theme={theme}
                    defaultSelectedKeys={["dashboard"]}
                    selectedKeys={["dashboard"]}
                >
                    <Menu.Item key="dashboard">
                        <Icon type="dashboard" />
                        <span>Editor</span>
                    </Menu.Item>
                    <Menu.SubMenu key="settings" title={<span><Icon type="setting"/><span>Settings</span></span>}>
                        <Menu.Item key="theme">
                            Change Theme
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </AntSider>
        );
    }

}