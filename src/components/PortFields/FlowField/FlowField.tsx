import { Button, Col, Input, Row, Tooltip } from 'antd';
import * as React from 'react';
import { IPortProps } from '../PortProps';

interface IOFieldState {
    label: string;
}

class FlowField extends React.Component<IPortProps, IOFieldState> {
    public static getDerivedStateFromProps(nextProps) {
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

    public render() {
        const { label } = this.state;

        const centerStyle: React.CSSProperties = {
            textAlign: 'center',
        };

        return (
            <Row type="flex" justify="space-between" align="middle" gutter={4}>
                <Col span={23}>
                    <Input
                        name="label"
                        value={label || ''}
                        type="text"
                        placeholder="Label"
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

export default FlowField;
