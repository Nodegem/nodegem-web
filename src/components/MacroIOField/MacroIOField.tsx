import { Input, Switch, Icon, Button, Tooltip, Col, Row } from 'antd';
import * as React from 'react';
import { ValueTypeControl } from '../ValueTypeControl/ValueTypeControl';

interface IOFieldProps {
    ioType: IOType;
    onDelete?: (ioType: IOType) => void;
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

    private onDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete(this.props.ioType);
        }
    };

    public render() {
        const { ioType } = this.props;
        const { fieldValue } = this.state;

        const centerStyle: React.CSSProperties = {
            textAlign: 'center',
        };

        const isValueType = ioType === 'valueOutput' || ioType === 'valueInput';

        return (
            <Row type="flex" gutter={8}>
                <Col span={!isValueType ? 23 : 17}>
                    <Input
                        value={fieldValue || ''}
                        type="text"
                        placeholder="Name"
                        onChange={this.onChange}
                    />
                </Col>
                {isValueType && (
                    <Col span={6} style={centerStyle}>
                        <ValueTypeControl />
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

export default IOField;
