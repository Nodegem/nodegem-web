import React from "react";
import { Menu, Layout, Icon } from "antd";
import { observer } from "mobx-react";
import { appStore } from "../../stores/app-store";
import { Link } from "react-router-dom";

import './Sider.scss';

const AntSider = Layout.Sider;

interface SiderProps {
    width?: number;
}

@observer
export default class Sider extends React.Component<SiderProps> {

    static defaultProps : SiderProps = {
        width: 200
    }

    handleCollapse = () => {
        appStore.toggleCollapsed();
    }

    public render() {

        const { collapsed, theme } = appStore;
        const { width } = this.props;

        return (
            <AntSider
                theme={theme}
                collapsed={collapsed}
                width={width}
                collapsible
                onCollapse={this.handleCollapse}
            >
                <Menu
                    mode="inline"
                    theme={theme}
                    defaultSelectedKeys={["dashboard"]}
                    selectedKeys={["dashboard"]}
                >
                    <Menu.Item key="project">
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
                </Menu>
            </AntSider>
        );
    }

}