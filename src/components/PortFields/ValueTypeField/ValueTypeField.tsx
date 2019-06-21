import { Input, Button, Tooltip, Col, Row, Checkbox } from 'antd';
import * as React from 'react';
import { ValueTypeDropDown } from './ValueTypeDropDown';
import { valueMap } from 'src/utils/value-type-mapper';
import { PortProps } from '../PortProps';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface IOFieldState {
    label: string;
    type: number;
    defaultValue?: any;
}

class ValueTypeField extends React.Component<PortProps, IOFieldState> {
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
            defaultValue: value.defaultValue || undefined,
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
            this.props.onDelete(this.props.ioType, this.props.fieldKey);
        }
    };

    private onTypeChange = (value: number) => {
        this.setState({ type: value });
        this.triggerChange({ type: value });
    };

    public render() {
        const { ioType } = this.props;
        const { label, type, defaultValue } = this.state;

        const centerStyle: React.CSSProperties = {
            textAlign: 'center',
        };

        const isValueInput = ioType === 'valueInput';
        return (
            <Row type="flex" justify="space-between" align="middle" gutter={2}>
                <Col span={!isValueInput ? 16 : 8}>
                    <Input
                        name="label"
                        value={label || ''}
                        type="text"
                        placeholder="Label"
                        onChange={this.onChange}
                    />
                </Col>
                <Col span={!isValueInput ? 6 : 4} style={centerStyle}>
                    <Tooltip title="Value Type">
                        <ValueTypeDropDown
                            onChange={this.onTypeChange}
                            value={valueMap[type || 0]}
                        />
                    </Tooltip>
                </Col>
                {isValueInput && (
                    <Col span={6} style={centerStyle}>
                        <Input
                            name="defaultValue"
                            value={defaultValue || ''}
                            type="text"
                            placeholder="Default Value"
                            onChange={this.onChange}
                        />
                    </Col>
                )}
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

export default ValueTypeField;
