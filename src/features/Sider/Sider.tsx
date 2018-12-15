import './Sider.scss';

import { Icon, Layout, Menu } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { AuthStore } from 'src/stores/auth-store';
import { CommonStore } from 'src/stores/common-store';
import { UserStore } from 'src/stores/user-store';

const AntSider = Layout.Sider;

const SettingsIcon = <span><Icon type="setting" /><span>Settings</span></span>;

interface SiderProps {
    commonStore?: CommonStore,
    userStore?: UserStore,
    authStore?: AuthStore
}

@inject('commonStore', 'userStore', 'authStore')
@observer
class Sider extends React.Component<SiderProps & RouteComponentProps<any>> {

    handleCollapse = () => {
        this.props.commonStore!.toggleCollapsed();
    }

    handleBreakpoint = (broken: boolean) => {
        this.props.commonStore!.setBreakpoint(broken);
    }

    themeClick = () => {
        this.props.commonStore!.changeTheme();
    }

    logout = () => {
        this.props.authStore!.logout();
    }

    public render() {

        const { location, commonStore, userStore } = this.props;
        const { collapseWidth, collapsed, siderWidth, theme } = commonStore!;

        let selected = location.pathname.replace("/", "");
        if(!selected) { 
            selected = "home";
        }

        return (
            <AntSider
                theme={theme}
                collapsed={collapsed}
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
                    <Menu.SubMenu title={SettingsIcon} key="settings">
                        <Menu.Item key="profile">
                            <Link to="/profile">
                                <Icon type="profile" />
                                Profile Settings
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="theme" onClick={this.themeClick}>
                            <Icon type="bg-colors" />
                            Change Theme
                        </Menu.Item>
                        <Menu.Item key="logout" onClick={this.logout}>
                            <Icon type="logout" />
                            Logout
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </AntSider>
        );
    }

}

export default withRouter(Sider);