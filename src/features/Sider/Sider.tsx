import React from "react";
import { Menu, Layout, Icon } from "antd";
import { observer, inject } from "mobx-react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";

import './Sider.scss';

const AntSider = Layout.Sider;

const SettingsIcon = <span><Icon type="setting" /><span>Settings</span></span>;

interface SiderProps {
    appStore?: IAppStore,
    userStore?: IUserStore
}

@inject('appStore', 'userStore')
@observer
class Sider extends React.Component<SiderProps & RouteComponentProps<any>> {

    private handleCollapse = () => {
        this.props.appStore!.toggleCollapsed();
    }

    private themeClick = () => {
        this.props.appStore!.changeTheme();
    }

    public render() {

        const { location, appStore, userStore } = this.props;

        let selected = location.pathname.replace("/", "");
        if(!selected) { 
            selected = "home";
        }

        return (
            <AntSider
                theme={appStore!.theme}
                collapsed={appStore!.collapsed}
                breakpoint="lg"
                collapsedWidth={0}
                width={200}
                collapsible
                onCollapse={this.handleCollapse}
            >
                <div className="logo-container">
                    <img src="https://via.placeholder.com/50x50" />
                </div>

                <Menu
                    mode="inline"
                    theme={appStore!.theme}
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