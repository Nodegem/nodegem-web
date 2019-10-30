import { Avatar, Dropdown, Icon, Layout, Menu } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { SiderTheme } from 'antd/lib/layout/Sider';
import { FlexFillGreedy, FlexRow } from 'components/Flex';
import { Link } from 'react-router-dom';

import logoPath from '../../logo.svg';

import { useStore } from 'overstated';
import { appStore, authStore, commonStore, userStore } from 'stores';
import './Header.less';

const AntHeader = Layout.Header;

const menu = (theme: SiderTheme, logout: () => void) => (
    <Menu theme={theme}>
        <Menu.Item key="dashboard">
            <Link to="/">
                <Icon type="dashboard" />
                Home
            </Link>
        </Menu.Item>
        <Menu.Item key="Sandbox">
            <Link to="/sandbox">
                <Icon type="branches" />
                Sandbox
            </Link>
        </Menu.Item>
        <Menu.Item key="settings">
            <Link to="/profile">
                <Icon type="setting" />
                Settings
            </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout" onClick={logout}>
            <Link to="/login">
                <Icon type="logout" />
                Logout
            </Link>
        </Menu.Item>
    </Menu>
);

export const Header: React.FC = () => {
    const { user } = useStore(appStore.userStore, store => ({
        user: store.user,
    }));

    const headerHeight = `${commonStore.headerHeight}px`;

    return (
        <AntHeader
            className="app-header"
            style={{ height: headerHeight, lineHeight: headerHeight }}
        >
            <FlexRow>
                <FlexRow className="header-logo">
                    <Link to="/">
                        <img src={logoPath} />
                    </Link>
                </FlexRow>
                <FlexFillGreedy />
                <FlexRow>
                    <div className="app-avatar">
                        <Dropdown
                            className="avatar-menu"
                            placement="bottomRight"
                            overlay={menu(commonStore.theme, authStore.logout)}
                            trigger={['click']}
                        >
                            <div>
                                <span className="username">
                                    {user.userName}
                                    <Icon type="caret-down" />
                                </span>
                                <Avatar
                                    size={45}
                                    icon="user"
                                    shape="square"
                                    src={user.avatarUrl || ''}
                                />
                            </div>
                        </Dropdown>
                    </div>
                </FlexRow>
            </FlexRow>
        </AntHeader>
    );
};
