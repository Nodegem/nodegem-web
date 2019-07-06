import {
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
} from 'antd';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { SelectProps } from 'antd/lib/select';
import moment from 'moment';
import * as React from 'react';

const Option = Select.Option;

interface IRecurringOptionProps {
    onChange?: (state: any) => void;
    fd: <T extends Object = {}>(
        id: keyof T,
        options?: GetFieldDecoratorOptions | undefined
    ) => (node: React.ReactNode) => React.ReactNode;
}

interface IRecurringOptionState {
    start: Date;
    until?: Date;
    iterations?: number;
    every: number;
    frequency: FrequencyOptions;
}

class RecurringOptionsControl extends React.Component<
    IRecurringOptionProps,
    IRecurringOptionState
> {
    public static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    constructor(props: any) {
        super(props);

        const value = props.value || {};
        this.state = {
            start: value.start || new Date(),
            until: value.until || undefined,
            iterations: value.iterations || undefined,
            every: value.every || 1,
            frequency: value.frequency || 'daily',
        };
    }

    private validate = (rule, value, callback) => {
        callback();
    };

    private triggerChange = (changedValue: object) => {
        if (this.props.onChange) {
            this.props.onChange({ ...this.state, ...changedValue });
        }
    };

    private onFrequencyChange = (value: string) => {
        this.setState({ frequency: value as FrequencyOptions });
        this.triggerChange({ frequency: value as FrequencyOptions });
    };

    private onDateChange = (date: moment.Moment, dateString: string) => {
        this.setState({ start: date.toDate() });
        this.triggerChange({ start: date.toDate() });
    };

    private onUntilChange = (date: moment.Moment, dateString: string) => {
        this.setState({ start: date.toDate() });
        this.triggerChange({ start: date.toDate() });
    };

    private onEveryChange = (value: number) => {
        this.setState({ every: value });
        this.triggerChange({ every: value });
    };

    private onIterationChange = (value: number) => {
        this.setState({ iterations: value });
        this.triggerChange({ iterations: value });
    };

    public render() {
        const { fd } = this.props;
        const { every, frequency, iterations, start, until } = this.state;

        return (
            <>
                <Card title="Recurring Options" bordered={false}>
                    <Form.Item label="Start">
                        {fd('recurringOptions[start]', {
                            initialValue: moment(start),
                            rules: [{ validator: this.validate }],
                        })(
                            <DatePicker
                                allowClear={false}
                                placeholder="Select date"
                                onChange={this.onDateChange}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Frequency">
                        <Row type="flex" gutter={12}>
                            <Col span={4}>
                                {fd('recurringOptions[frequency]', {
                                    initialValue: frequency,
                                    rules: [{ validator: this.validate }],
                                })(
                                    <Select
                                        placeholder="Frequency"
                                        onChange={this.onFrequencyChange}
                                    >
                                        {Object.keys(repeatOptionMap).map(x => (
                                            <Option value={x} key={x}>
                                                {repeatOptionMap[x]}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Col>
                            <Col span={4}>
                                {fd('recurringOptions[every]', {
                                    initialValue: every,
                                    rules: [{ validator: this.validate }],
                                })(
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        onChange={this.onEveryChange}
                                        placeholder="Every"
                                    />
                                )}
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="Iterations">
                        {fd('recurringOptions[iterations]', {
                            initialValue: iterations,
                            rules: [{ validator: this.validate }],
                        })(
                            <InputNumber
                                style={{ width: '30%' }}
                                onChange={this.onIterationChange}
                                placeholder="Iterations"
                            />
                        )}
                    </Form.Item>
                    <Form.Item label="Until">
                        {fd('recurringOptions[until]', {
                            initialValue: until,
                            rules: [{ validator: this.validate }],
                        })(
                            <DatePicker
                                placeholder="Select date"
                                onChange={this.onUntilChange}
                            />
                        )}
                    </Form.Item>
                </Card>
            </>
        );
    }
}

const repeatOptionMap: { [key: string]: string } = {
    yearly: 'Yearly',
    monthly: 'Monthly',
    daily: 'Daily',
    hourly: 'Hourly',
    minutely: 'Minutely',
    secondly: 'Secondly',
};

export default RecurringOptionsControl;
