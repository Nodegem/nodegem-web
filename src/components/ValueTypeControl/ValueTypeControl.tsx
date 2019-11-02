import { Select as $Select } from 'antd';
import { PhoneInput } from 'components';
import {
    DatePicker,
    Input,
    InputNumber,
    Switch,
    TimePicker,
} from 'formik-antd';
import React from 'react';

const Option = $Select.Option;

const selectBefore = (value: string, isDisabled: boolean | undefined) => (
    <$Select
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
    </$Select>
);

interface IValueTypeControlProps {
    name: string;
    value?: any;
    placeHolder?: string;
    valueType?: ValueType;
    disabled: boolean;
    onChange?: (value: any) => void;
}

export const ValueTypeControl: React.FC<IValueTypeControlProps> = ({
    value,
    name,
    placeHolder,
    disabled,
    onChange,
    valueType,
}) => {
    const handleChange = newValue => onChange && onChange(newValue);
    switch (valueType) {
        case 'boolean':
            return (
                <Switch
                    name={name}
                    disabled={disabled}
                    onChange={handleChange}
                />
            );
        case 'number':
            return (
                <InputNumber
                    name={name}
                    disabled={disabled}
                    onChange={handleChange}
                />
            );
        case 'url':
            return (
                <Input
                    name={name}
                    addonBefore={selectBefore(
                        value && value.toString(),
                        disabled
                    )}
                    disabled={disabled}
                    onChange={event => handleChange(event.target.value)}
                />
            );
        case 'phonenumber':
            return (
                <PhoneInput
                    name={name}
                    disabled={disabled}
                    onChange={handleChange}
                />
            );
        case 'date':
            return (
                <DatePicker
                    name={name}
                    disabled={disabled}
                    onChange={handleChange}
                />
            );

        case 'datetime':
            return (
                <DatePicker
                    name={name}
                    disabled={disabled}
                    allowClear
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={handleChange}
                />
            );
        case 'time':
            return (
                <TimePicker
                    name={name}
                    disabled={disabled}
                    allowClear
                    use12Hours={navigator.language.startsWith('en-US')}
                    onChange={handleChange}
                />
            );
        case 'textarea':
            return (
                <Input.TextArea
                    name={name}
                    disabled={disabled}
                    autosize={{ minRows: 2 }}
                    onChange={event => handleChange(event.target.value)}
                />
            );
        default:
            return (
                <Input
                    name={name}
                    placeholder={placeHolder}
                    disabled={disabled}
                    onChange={event => handleChange(event.target.value)}
                />
            );
    }
};
