import React from "react";
import { Menu, Layout, Icon } from "antd";
import { observer } from "mobx-react";
import { appStore } from "../../stores/app-store";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

import './Sider.scss';

const AntSider = Layout.Sider;

interface SiderProps {
    width?: number;
}

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
                </Menu>
            </AntSider>
        );
    }

}

export default withRouter(Sider);