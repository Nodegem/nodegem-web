import { Input, Switch } from 'antd';
import * as React from 'react';

interface IOFieldProps {
    onChange?: (state: any) => void;
}

interface IOFieldState {
    secret: boolean;
    fieldValue: any;
}

class IOField extends React.Component<IOFieldProps, IOFieldState> {
    static getDerivedStateFromProps(nextProps) {
        console.log(nextProps);
        // Should be a controlled component.
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);

        const value = props.value || {};
        this.state = {
            secret: value.secret || false,
            fieldValue: value.fieldValue || '',
        };
    }

    public render() {
        const { secret, fieldValue } = this.state;

        return (
            <span>
                <Input
                    value={fieldValue}
                    type="text"
                    placeholder="Name"
                    style={{ width: '79%', marginRight: '3%' }}
                />
                <span>
                    <p
                        style={{
                            display: 'inline',
                            marginBottom: 0,
                            marginRight: 5,
                        }}
                    >
                        Secret?:{' '}
                    </p>
                    <Switch checked={secret} />
                </span>
            </span>
        );
    }
}

export default IOField;
