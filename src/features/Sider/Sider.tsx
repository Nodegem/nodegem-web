import React from "react";
import { Menu, Layout, Icon } from "antd";
import { observer, inject } from "mobx-react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

import './Sider.scss';
import { AppStore } from "src/stores/app-store";
import { UserStore } from "src/stores/user-store";
import { CollapseType } from "antd/lib/layout/Sider";

const AntSider = Layout.Sider;

const SettingsIcon = <span><Icon type="setting" /><span>Settings</span></span>;

interface SiderProps {
    appStore?: AppStore,
    userStore?: UserStore
}

@inject('appStore', 'userStore')
@observer
class Sider extends React.Component<SiderProps & RouteComponentProps<any>> {

    private handleCollapse = (collapsed) => {
        this.props.appStore!.toggleCollapsed(collapsed);
    }

    private handleBreakpoint = (broken: boolean) => {
        this.props.appStore!.setBreakpoint(broken);
    }

    private themeClick = () => {
        this.props.appStore!.changeTheme();
    }

    public render() {

        const { location, appStore, userStore } = this.props;

        const { collapseWidth, collapsed, siderWidth, theme } = appStore!;

        let selected = location.pathname.replace("/", "");
        if(!selected) { 
            selected = "home";
        }

        return (
            <AntSider
                theme={theme}
                collapsed={collapsed}
                defaultCollapsed={true}
                breakpoint="sm"
                width={siderWidth}
                collapsedWidth={collapseWidth}
                collapsible
                onBreakpoint={this.handleBreakpoint}
                onCollapse={this.handleCollapse}
            >
                <div className="logo-container">
                    <img src="https://via.placeholder.com/50x50" />
                </div>

                <Menu
                    mode="inline"
                    theme={theme}
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
                        userStore!.isLoggedIn && (
                            <Menu.SubMenu title={SettingsIcon} key="settings">
                                <Menu.Item key="theme" onClick={this.themeClick}>
                                    <Icon type="bg-colors" />
                                    Change Theme
                                </Menu.Item>    
                            </Menu.SubMenu>
                        )
                    }
                </Menu>
            </AntSider>
        );
    }

}

export default withRouter(Sider);