import { DatePicker, Form, Input, Select, TimePicker } from 'antd';
import React from 'react';

const FormItem = Form.Item;
const Option = Select.Option;

export const CreateAntField = AntComponent => ({
    field,
    form,
    hasFeedback,
    label,
    selectOptions,
    submitCount,
    type,
    ...props
}) => {
    const touched = form.touched[field.name];
    const submitted = submitCount > 0;
    const hasError = form.errors[field.name];
    const submittedError = hasError && submitted;
    const touchedError = hasError && touched;
    const onInputChange = (value: any | React.SyntheticEvent) => {
        if (value && value.target) {
            form.setFieldValue(field.name, value.target.value);
        } else {
            form.setFieldValue(field.name, value);
        }
    };
    const onChange = (value: any | React.SyntheticEvent) => {
        if (value && value.target) {
            form.setFieldValue(field.name, value.target.value);
        } else {
            form.setFieldValue(field.name, value);
        }
    };
    const onBlur = () => form.setFieldTouched(field.name, true);
    console.log(props);
    return (
        <div className="field-container">
            <FormItem
                label={label}
                hasFeedback={
                    (hasFeedback && submitted) || (hasFeedback && touched)
                        ? true
                        : false
                }
                help={submittedError || touchedError ? hasError : false}
                validateStatus={
                    submittedError || touchedError ? 'error' : 'success'
                }
            >
                <AntComponent
                    {...field}
                    {...props}
                    onBlur={onBlur}
                    onChange={type ? onInputChange : onChange}
                >
                    {selectOptions &&
                        selectOptions.map(name => (
                            <Option key={name}>{name}</Option>
                        ))}
                </AntComponent>
            </FormItem>
        </div>
    );
};

export const AntSelect = CreateAntField(Select);
export const AntDatePicker = CreateAntField(DatePicker);
export const AntTimePicker = CreateAntField(TimePicker);
export const AntInput = CreateAntField(Input);
