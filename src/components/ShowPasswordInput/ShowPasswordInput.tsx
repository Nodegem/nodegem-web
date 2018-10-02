import * as React from 'react';
import classNames from 'classnames';
import { Icon, Input } from 'antd';

import './ShowPasswordInput.scss';

export default class ShowPasswordInput extends React.Component<{ placeHolder?: string }, { showPassword: boolean }> {
    
    state = {
        showPassword: false
    }

    static defaultProps = {
        placeHolder: "Password"
    }

    private onLockClick = () => {
        this.setState({ showPassword: !this.state.showPassword });
    }

    public render() {

        const { showPassword } = this.state;
        const { placeHolder } = this.props;

        const lockIconString = showPassword ? "unlock" : "lock";
        const passwordType = showPassword ? "text" : "password";
        
        const lockClass = classNames({
            "lock-icon": true,
            "locked": !showPassword,
            "unlocked": showPassword
        });

        return (
            <Input prefix={<Icon type={lockIconString} className={lockClass} onClick={this.onLockClick} />} type={passwordType} placeholder={placeHolder} />
        );
    }

}