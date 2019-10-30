import {
    DatePicker,
    Input,
    InputNumber,
    Select,
    Switch,
    TimePicker,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { PhoneInput } from 'components';
import moment from 'moment';
import React from 'react';

const Option = Select.Option;

const selectBefore = (value: string, isDisabled: boolean | undefined) => (
    <Select
        disabled={isDisabled}
        value={
            value && value.toLowerCase().includes('http://')
                ? 'Http://'
                : 'Https://'
        }
        style={{ width: 90 }}
    >
        <Option value="Http://">Http://</Option>
        <Option value="Https://">Https://</Option>
    </Select>
);

interface IValueTypeControlProps {
    name: string;
    value?: any;
    defaultValue?: any;
    valueType?: ValueType;
    disabled: boolean;
    onChange: (value: any) => void;
}

export const ValueTypeControl: React.FC<IValueTypeControlProps> = ({
    value,
    defaultValue,
    name,
    disabled,
    onChange,
    valueType,
}) => {
    switch (valueType) {
        case 'boolean':
            return (
                <Switch
                    checked={value || defaultValue}
                    disabled={disabled}
                    onChange={onChange}
                />
            );
        case 'number':
            return (
                <InputNumber
                    value={value || defaultValue}
                    disabled={disabled}
                    onChange={onChange}
                />
            );
        case 'url':
            return (
                <Input
                    addonBefore={selectBefore(
                        value && value.toString(),
                        disabled
                    )}
                    value={value || defaultValue}
                    disabled={disabled}
                    onChange={event => onChange(event.target.value)}
                />
            );
        case 'phonenumber':
            return (
                <PhoneInput
                    value={value || defaultValue}
                    disabled={disabled}
                    onChange={onChange}
                />
            );
        case 'date':
            return (
                <DatePicker
                    value={moment(value) || moment(defaultValue)}
                    disabled={disabled}
                    onChange={onChange}
                />
            );

        case 'datetime':
            return (
                <DatePicker
                    value={moment(value) || moment(defaultValue)}
                    disabled={disabled}
                    allowClear
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={onChange}
                />
            );
        case 'time':
            return (
                <TimePicker
                    value={moment(value) || moment(defaultValue)}
                    disabled={disabled}
                    allowClear
                    use12Hours={navigator.language.startsWith('en-US')}
                    onChange={onChange}
                />
            );
        case 'textarea':
            return (
                <TextArea
                    value={value || defaultValue}
                    disabled={disabled}
                    autosize={{ minRows: 2 }}
                    onChange={event => onChange(event.target.value)}
                />
            );
        default:
            return (
                <Input
                    placeholder={name}
                    disabled={disabled}
                    value={value || defaultValue}
                    onChange={event => onChange(event.target.value)}
                />
            );
    }
};
