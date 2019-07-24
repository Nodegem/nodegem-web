import { Avatar, Col, Dropdown, Icon, Layout, Menu, Row } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStore } from 'stores/StoreProvider';

import { SiderTheme } from 'antd/lib/layout/Sider';
import './Header.less';

const AntHeader = Layout.Header;

const menu = (theme: SiderTheme, logout: () => void) => (
    <Menu theme={theme}>
        <Menu.Item key="settings">
            <Icon type="setting" />
            Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout" onClick={logout}>
            <Icon type="logout" />
            Logout
        </Menu.Item>
    </Menu>
);

export const Header: React.FC = observer(() => {
    const { commonStore, authStore } = useStore();
    const headerHeight = commonStore.headerHeight;
    return (
        <AntHeader
            className="app-header"
            style={{ height: headerHeight, lineHeight: headerHeight }}
        >
            <Row>
                <Col span={2}>
                    <div>
                        <img src="https://via.placeholder.com/40" />
                    </div>
                </Col>
                <Col span={20}>
                    <Menu
                        theme={commonStore.theme}
                        mode="horizontal"
                        style={{ lineHeight: commonStore.headerHeight }}
                    />
                </Col>
                <Col span={2}>
                    <div className="app-avatar">
                        <span className="username">Test</span>
                        <Dropdown
                            placement="bottomRight"
                            overlay={menu(commonStore.theme, authStore.logout)}
                            trigger={['click', 'hover']}
                        >
                            <Avatar size={35} icon="user" />
                        </Dropdown>
                    </div>
                </Col>
            </Row>
        </AntHeader>
    );
});
