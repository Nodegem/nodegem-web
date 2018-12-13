import { Icon, Input } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { InputProps } from 'antd/lib/input';

class PasswordInput extends React.Component<InputProps, { showPassword: boolean }> {

    state = {
        showPassword: false
    };

    onLockClick = () => {
        const { showPassword } = this.state;
        this.setState({ showPassword: !showPassword });
    }

    public render() {
        const { showPassword } = this.state;

        const lockIconString = showPassword ? "unlock" : "lock";
        const passwordType = showPassword ? "text" : "password";

        const lockClass = classNames({
            "lock-icon": true,
            locked: !showPassword,
            unlocked: showPassword
        });

        return (
            <Input
                prefix={
                    <Icon
                        type={lockIconString}
                        className={lockClass}
                        onClick={this.onLockClick}
                    />
                }
                type={passwordType}
                placeholder="Password"
                {...this.props}
            />
        );
    }
}

export default PasswordInput;