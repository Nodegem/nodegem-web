import { PhoneInput } from 'components';
import {
    DatePicker,
    Input,
    InputNumber,
    Switch,
    TimePicker,
    Select,
} from 'formik-antd';
import React from 'react';

interface IValueTypeControlProps {
    name: string;
    placeHolder?: string;
    valueType?: ValueType;
    disabled: boolean;
    onChange?: (value: any) => void;
    valueOptions?: IValueOption[];
}

export const ValueTypeControl: React.FC<IValueTypeControlProps> = ({
    name,
    placeHolder,
    disabled,
    onChange,
    valueType,
    valueOptions,
}) => {
    const handleChange = newValue => onChange && onChange(newValue);

    if (valueOptions && valueOptions.any()) {
        return (
            <Select name={name} onChange={handleChange}>
                {valueOptions.map((vo, i) => (
                    <Select.Option key={i} value={vo.value}>
                        {vo.label}
                    </Select.Option>
                ))}
            </Select>
        );
    }

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
                    autoSize={{ minRows: 2 }}
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
