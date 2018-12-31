import { Input, Switch, Icon, Button, Tooltip } from 'antd';
import * as React from 'react';

interface IOFieldProps {
    onDelete?: () => void;
    onChange?: (state: any) => void;
}

interface IOFieldState {
    fieldValue: any;
}

class IOField extends React.Component<IOFieldProps, IOFieldState> {
    static getDerivedStateFromProps(nextProps) {
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
            fieldValue: value.fieldValue || '',
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ fieldValue: e.target.value });
        this.triggerChange({ fieldValue: e.target.value });
    };

    private triggerChange = (changedValue: object) => {
        if (this.props.onChange) {
            this.props.onChange({ ...this.state, ...changedValue });
        }
    };

    public render() {
        const { onDelete } = this.props;
        const { fieldValue } = this.state;

        return (
            <span>
                <Input
                    value={fieldValue || ''}
                    type="text"
                    placeholder="Name"
                    style={{ width: '92%', marginRight: '3%' }}
                    onChange={this.onChange}
                />
                {/* <span style={{ marginRight: '4%' }}>
                    <p
                        style={{
                            display: 'inline',
                            marginBottom: 0,
                            marginRight: 5,
                        }}
                    >
                        Secret?:{' '}
                    </p>
                    <Switch checked={secret} onChange={this.onSecretChange} />
                </span> */}
                <Tooltip title="Remove">
                    <Button
                        onClick={onDelete}
                        style={{ display: 'inline' }}
                        type="danger"
                        ghost
                        icon="minus"
                        size="small"
                        shape="circle"
                    />
                </Tooltip>
            </span>
        );
    }
}

export default IOField;
