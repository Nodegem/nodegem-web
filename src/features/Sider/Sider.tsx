import React from "react";
import { Menu, Layout, Icon } from "antd";
import { SiderTheme } from "antd/lib/layout/Sider";
import { ComponentBase } from "resub";

const AntSider = Layout.Sider;

export interface SiderState {
    collapsed: boolean;
    theme: SiderTheme;
    selectedKeys: string[];
}

export default class Sider extends ComponentBase<{}, SiderState> {

    handleCollapse() {

    }

    public render() {
        return (
            <AntSider
                theme="dark"
                collapsible
                onCollapse={this.handleCollapse}
            >
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["dashboard"]}
                >
                    <Menu.Item key="dashboard">
                        <Icon type="dashboard" />
                        <span>Editor</span>
                    </Menu.Item>
                </Menu>
            </AntSider>
        );
    }

}