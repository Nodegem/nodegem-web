import * as React from 'react';
import { Layout, Menu, Avatar, Icon } from 'antd';

import './Header.scss';
import { observer } from 'mobx-react';
import { appStore } from '../../stores/app-store';
import { userStore } from '../../stores/user-store';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

const AntHeader = Layout.Header;

const UserIcon = <span className="user-settings"><Avatar icon="user" size="large" /></span>

@observer
class Header extends React.Component<RouteComponentProps<any>> {

    private handleClick = ({ item, key, keyPath }) : void => {

        switch(key) {
            case "theme":
                appStore.toggleTheme();
                break;
            case "logout": 
                userStore.logout();
                break;
        }
    }

    public render() {

        const { theme } = appStore;

        return (
            <AntHeader className="header">
                <Menu mode="horizontal" 
                        theme={theme} 
                        style={{lineHeight: "64px"}} 
                        onClick={this.handleClick}
                        defaultSelectedKeys={[]}
                        selectedKeys={[]}
                >
                    <Menu.SubMenu className="header-user-icon" title={UserIcon}>
                        <Menu.Item key="theme">
                            <Icon type="bg-colors" />
                            Change Theme
                        </Menu.Item>
                        <Menu.Item key="settings">
                            <Link to='/'>
                                <Icon type="setting" />
                                Profile Settings
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="logout">
                            <Link to="/">
                                <Icon type="poweroff" />
                                Logout
                            </Link>
                        </Menu.Item>
                    </Menu.SubMenu>
                </Menu>
            </AntHeader>
        )
    }

}

export default withRouter(Header);