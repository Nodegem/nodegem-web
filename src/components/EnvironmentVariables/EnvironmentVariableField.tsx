import * as React from 'react';
import { Tooltip, Button, Input, Row, Col, Select } from 'antd';

const Option = Select.Option;

interface IOFieldProps {
    onDelete?: () => void;
    onChange?: (state: any) => void;
}

interface IOFieldState {
    fieldValue: any;
    secret: boolean;
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
            secret: value.secret || false,
            fieldValue: value.fieldValue || '',
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ fieldValue: e.target.value });
        this.triggerChange({ fieldValue: e.target.value });
    };

    private onSecretChange = () => {
        this.setState({ secret: !this.state.secret });
        this.triggerChange({ secret: !this.state.secret });
    };

    private triggerChange = (changedValue: object) => {
        if (this.props.onChange) {
            this.props.onChange({ ...this.state, ...changedValue });
        }
    };

    public render() {
        const { onDelete } = this.props;
        const { fieldValue, secret } = this.state;

        return (
            <span>
                <Row type="flex" align="middle" gutter={4}>
                    <Col span={16}>
                        <Input
                            value={fieldValue || ''}
                            type={secret ? 'password' : 'text'}
                            placeholder="Name"
                            onChange={this.onChange}
                        />
                    </Col>
                    <Col span={4}>
                        <Select placeholder="Type" showSearch>
                            <Option value="test">Test</Option>
                        </Select>
                    </Col>
                    <Col span={3} style={{ textAlign: 'center' }}>
                        <Tooltip title="Secret?">
                            <Button
                                onClick={this.onSecretChange}
                                type="default"
                                icon={secret ? 'lock' : 'unlock'}
                                shape="circle"
                            />
                        </Tooltip>
                    </Col>
                    <Col span={1} style={{ textAlign: 'center' }}>
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
            </span>
        );
    }
}

export default EnvironmentVariableField;
