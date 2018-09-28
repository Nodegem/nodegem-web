import * as React from 'react';
import { Layout, Menu } from 'antd';

import './Header.scss';
import { observer } from 'mobx-react';
import { appStore } from '../../stores/app-store';

const AntHeader = Layout.Header;

@observer
export default class Header extends React.Component {

    public render() {

        const { theme } = appStore;

        return (
            <AntHeader className="header">
                <Menu theme={theme}>

                </Menu>
            </AntHeader>
        )
    }

}