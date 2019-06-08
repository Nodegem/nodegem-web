import * as React from 'react';
import { valueMap } from 'src/utils/value-type-mapper';
import { ValueTypeDropDown } from '../PortFields';
import { Tooltip, Col, Input, Row, Button, Checkbox, Icon } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface ConstantFieldProps {
    constantKey: string;
    onDelete?: (id: string) => void;
    onChange?: (state: any) => void;
}

interface ConstantFieldState {
    label: string;
    type: number;
    value: any;
    isSecret: boolean;
}

class ConstantField extends React.Component<
    ConstantFieldProps,
    ConstantFieldState
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
            label: value.label || '',
            type: value.type || 0,
            value: value.value || undefined,
            isSecret: value.isSecret || false,
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [e.target.name]: e.target.value } as object);
        this.triggerChange({ [e.target.name]: e.target.value });
    };

    private triggerChange = (changedValue: object) => {
        if (this.props.onChange) {
            this.props.onChange({ ...this.state, ...changedValue });
        }
    };

    private onDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete(this.props.constantKey);
        }
    };

    private onTypeChange = (value: number) => {
        this.setState({ type: value });
        this.triggerChange({ type: value });
    };

    private onSecretChange = (e: CheckboxChangeEvent) => {
        this.setState({ isSecret: e.target.checked });
        this.triggerChange({ isSecret: e.target.checked });
    };

    public render() {
        const { label, type, value, isSecret } = this.state;

        const centerStyle: React.CSSProperties = {
            textAlign: 'center',
        };

        return (
            <Row type="flex" justify="space-between" align="middle" gutter={2}>
                <Col span={2} style={centerStyle}>
                    <Tooltip title="Is Secret?">
                        <Checkbox
                            name="isSecret"
                            checked={isSecret || false}
                            onChange={this.onSecretChange}
                        >
                            <Icon type="key" />
                        </Checkbox>
                    </Tooltip>
                </Col>
                <Col span={8}>
                    <Input
                        name="label"
                        value={label || ''}
                        type="text"
                        placeholder="Name"
                        onChange={this.onChange}
                    />
                </Col>
                <Col span={4} style={centerStyle}>
                    <Tooltip title="Value Type">
                        <ValueTypeDropDown
                            onChange={this.onTypeChange}
                            value={valueMap[type || 0]}
                        />
                    </Tooltip>
                </Col>
                <Col span={8} style={centerStyle}>
                    <Input
                        name="value"
                        value={value || ''}
                        type={isSecret ? 'password' : 'text'}
                        placeholder="Value"
                        onChange={this.onChange}
                    />
                </Col>
                <Col span={1} style={centerStyle}>
                    <Tooltip title="Remove">
                        <Button
                            onClick={this.onDelete}
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

export default ConstantField;
