import * as React from 'react';
import { Tooltip, Button, Input, Row, Col, Select } from 'antd';
import { ValueTypeControl } from '../ValueTypeControl/ValueTypeControl';

const Option = Select.Option;

interface IOFieldProps {
    onDelete?: () => void;
    onChange?: (state: any) => void;
}

interface IOFieldState {
    name: string;
    value: any;
    isSecret: boolean;
    type: number;
}

class EnvironmentVariableField extends React.Component<
    IOFieldProps,
    IOFieldState
> {
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
            isSecret: value.isSecret || false,
            value: value.value || '',
            name: value.name || '',
            type: value.type || 0,
        };
    }

    private onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ name: e.target.value });
        this.triggerChange({ name: e.target.value });
    };

    private onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ value: e.target.value });
        this.triggerChange({ value: e.target.value });
    };

    private onSecretChange = () => {
        this.setState({ isSecret: !this.state.isSecret });
        this.triggerChange({ isSecret: !this.state.isSecret });
    };

    private triggerChange = (changedValue: object) => {
        if (this.props.onChange) {
            this.props.onChange({ ...this.state, ...changedValue });
        }
    };

    public render() {
        const { onDelete } = this.props;
        const { value, name, isSecret, type } = this.state;

        const centerStyle: React.CSSProperties = {
            textAlign: 'center',
        };

        return (
            <Row type="flex" align="middle" gutter={8}>
                <Col span={6}>
                    <Input
                        value={name || ''}
                        type="text"
                        placeholder="Name"
                        onChange={this.onNameChange}
                    />
                </Col>
                <Col span={10}>
                    <Input
                        value={value || ''}
                        type={isSecret ? 'password' : 'text'}
                        placeholder="Value"
                        onChange={this.onValueChange}
                    />
                </Col>
                <Col span={4}>
                    <ValueTypeControl />
                </Col>
                <Col span={2} style={centerStyle}>
                    <Tooltip title="Secret?">
                        <Button
                            onClick={this.onSecretChange}
                            type="default"
                            icon={isSecret ? 'lock' : 'unlock'}
                            shape="circle"
                        />
                    </Tooltip>
                </Col>
                <Col span={2} style={centerStyle}>
                    <Tooltip title="Remove">
                        <Button
                            onClick={onDelete}
                            type="danger"
                            ghost
                            icon="minus"
                            size="small"
                            shape="circle"
                        />
                    </Tooltip>
                </Col>
            </Row>
        );
    }
}

export default EnvironmentVariableField;
