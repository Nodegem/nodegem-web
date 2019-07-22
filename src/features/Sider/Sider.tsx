import './Sider.less';

import { Icon, Layout, Menu } from 'antd';
import { CollapseType } from 'antd/lib/layout/Sider';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { AuthStore } from 'stores/auth-store';
import { CommonStore } from 'stores/common-store';

const AntSider = Layout.Sider;

const SettingsIcon = (
    <span>
        <Icon type="setting" />
        <span>Settings</span>
    </span>
);

interface ISiderProps {
    commonStore?: CommonStore;
    authStore?: AuthStore;
}

@inject('commonStore', 'userStore', 'authStore')
@observer
class Sider extends React.Component<ISiderProps & RouteComponentProps<any>> {
    private hack = false;

    public handleCollapse = (collapsed: boolean, type: CollapseType) => {
        const isCollapsed = this.props.commonStore!.collapsed;
        if (!this.hack && isCollapsed && type === 'responsive' && !collapsed) {
            this.hack = true;
            return;
        }
        this.props.commonStore!.toggleCollapsed(collapsed);
    };

    public handleBreakpoint = (broken: boolean) => {
        this.props.commonStore!.setBreakpoint(broken);
    };

    public themeClick = () => {
        this.props.commonStore!.changeTheme();
    };

    public logout = () => {
        this.props.authStore!.logout();
    };

    public render() {
        const { location, commonStore } = this.props;
        const { collapseWidth, siderWidth, theme, collapsed } = commonStore!;

        let selected = location.pathname.replace('/', '');
        if (!selected) {
            selected = 'home';
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
                    defaultSelectedKeys={['project']}
                    selectedKeys={[selected]}
                >
                    <Menu.Item key="home">
                        <Link to="/">
                            <Icon type="dashboard" />
                            <span>Dashboard</span>
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
