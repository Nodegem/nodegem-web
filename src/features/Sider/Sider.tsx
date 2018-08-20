import React from "react";
import { Menu, Layout, Icon } from "antd";
import { SiderTheme } from "antd/lib/layout/Sider";
import { ComponentBase } from "resub";
import { appStore } from "../../stores/AppStore";

const AntSider = Layout.Sider;

export interface SiderState {
    collapsed: boolean;
    theme: SiderTheme;
    selectedKeys: string[];
}

export default class Sider extends ComponentBase<{}, SiderState> {

    protected _buildState() : Partial<SiderState> {
        return {
            collapsed: appStore.getSiderCollapsed(),
            theme: appStore.getSiderTheme(),
            selectedKeys: appStore.getSelectedKeys()
        };
    }

    handleCollapse = () => {
        appStore.setSiderCollapsed(!this.state.collapsed);
    }

    handleClick = ({item, key, keyPath}) => {

        if(!keyPath.includes("settings")) {
            appStore.setSelectedKeys(key);
        }

        if(key === "theme") {
            const { theme } = this.state;
            let newTheme : SiderTheme = theme === "dark" ? "light" : "dark";
            appStore.setSiderTheme(newTheme);
        }
    }

    public render() {

        const { theme, collapsed } = this.state;

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