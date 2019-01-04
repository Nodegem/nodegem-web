import { Input, Switch, Icon, Button, Tooltip, Col, Row } from 'antd';
import * as React from 'react';
import { ValueTypeControl } from '../ValueTypeControl/ValueTypeControl';

interface IOFieldProps {
    ioType: IOType;
    index: number;
    onDelete?: (ioType: IOType, index: number) => void;
    onChange?: (state: any) => void;
}

interface IOFieldState {
    label: any;
    type?: number;
}

class MacroIOField extends React.Component<IOFieldProps, IOFieldState> {
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
            label: value.value || '',
            type: value.type || undefined,
        };
    }

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ label: e.target.value });
        this.triggerChange({ label: e.target.value });
    };

    private triggerChange = (changedValue: object) => {
        if (this.props.onChange) {
            this.props.onChange({ ...this.state, ...changedValue });
        }
    };

    private onDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete(this.props.ioType, this.props.index);
        }
    };

    public render() {
        const { ioType } = this.props;
        const { label, type } = this.state;

        const centerStyle: React.CSSProperties = {
            textAlign: 'center',
        };

        const isValueType = ioType === 'valueOutput' || ioType === 'valueInput';

        return (
            <Row type="flex" gutter={8}>
                <Col span={!isValueType ? 23 : 17}>
                    <Input
                        value={label || ''}
                        type="text"
                        placeholder="Label"
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

export default MacroIOField;
