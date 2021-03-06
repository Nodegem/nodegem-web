import { Button, Divider, Icon } from 'antd';
import { FlexColumn, FlexRow } from 'components';
import { ValueTypeControl } from 'components/ValueTypeControl';
import { FieldArray, Formik, FormikHelpers } from 'formik';
import {
    Checkbox,
    Form,
    FormItem,
    Input,
    InputNumber,
    Radio,
    ResetButton,
    Select,
    SubmitButton,
} from 'formik-antd';
import { uuid } from 'lodash-uuid';
import React from 'react';
import { valueMap } from 'utils';
import * as Yup from 'yup';
import '../../types/yup.ts';

import './GraphForm.less';
import { ConstantsForm, ConstantsFormLayout } from 'components/ConstantsForm';

const valueOptions: ValueType[] = [
    'any',
    'text',
    'textarea',
    'boolean',
    'number',
    'time',
    'date',
    'datetime',
    'phonenumber',
    'url',
];

const repeatOptionMap: { [key: string]: string } = {
    yearly: 'Yearly',
    monthly: 'Monthly',
    daily: 'Daily',
    hourly: 'Hourly',
    minutely: 'Minutely',
    secondly: 'Secondly',
};

export interface IGraphFormValues {
    name: string;
    description?: string;
    type: ExecutionType;
    constants: IFormConstantData[];
    recurringOptions?: IFormRecurringOptions;
}

interface IFormRecurringOptions {
    frequency: FrequencyOptions;
    every: number;
}

const validationSchema = Yup.object().shape<IGraphFormValues>({
    name: Yup.string().required('Name is required'),
    description: Yup.string().notRequired(),
    type: Yup.mixed<ExecutionType>().oneOf(
        ['manual', 'listener', 'recurring'],
        'Must select an execution type'
    ),
    constants: Yup.array().of(
        Yup.object().shape<IFormConstantData>({
            key: Yup.string().required(),
            label: Yup.string().required('Label is required'),
            type: Yup.mixed<ValueType>()
                .oneOf(valueOptions)
                .required('A value type is required'),
            isSecret: Yup.boolean(),
            value: Yup.mixed().when('type', {
                is: 'url',
                then: Yup.string().url('Invalid Url'),
                otherwise: Yup.mixed(),
            }),
        })
    ),
    recurringOptions: Yup.object<IFormRecurringOptions>().when('type', {
        is: 'recurring',
        then: Yup.object().shape<IFormRecurringOptions>({
            every: Yup.number()
                .min(1, 'Must be >= 1')
                .required('Value is required'),
            frequency: Yup.mixed()
                .oneOf(Object.keys(repeatOptionMap))
                .notRequired(),
        }),
        otherwise: Yup.object().shape<IFormRecurringOptions>({
            every: Yup.number(),
            frequency: Yup.mixed()
                .oneOf(Object.keys(repeatOptionMap))
                .notRequired(),
        }),
    }),
});

interface IGraphFormProps {
    initialValue?: IGraphFormValues;
    handleSubmit: (
        values: IGraphFormValues,
        actions: FormikHelpers<IGraphFormValues>
    ) => void;
}

export const GraphForm: React.FC<IGraphFormProps> = ({
    initialValue,
    handleSubmit,
}) => {
    return (
        <Formik
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            initialValues={{
                name: (initialValue && initialValue.name) || '',
                description: (initialValue && initialValue.description) || '',
                type: (initialValue && initialValue.type) || 'manual',
                constants: (initialValue && initialValue.constants) || [],
                recurringOptions: (initialValue &&
                    initialValue.recurringOptions) || {
                    every: 1,
                    frequency: 'minutely',
                },
            }}
        >
            {({ isSubmitting, values }) => (
                <Form>
                    <FlexColumn className="graph-form" gap={15}>
                        <FormItem name="name" label="Name" required>
                            <Input name="name" placeholder="Name" />
                        </FormItem>
                        <FormItem name="description" label="Description">
                            <Input.TextArea
                                name="description"
                                placeholder="Description"
                            />
                        </FormItem>
                        <FormItem name="type" label="Execution Type">
                            <Radio.Group
                                name="type"
                                options={[
                                    { label: 'Manual', value: 'manual' },
                                    { label: 'Listener', value: 'listener' },
                                    { label: 'Recurring', value: 'recurring' },
                                ]}
                            />
                        </FormItem>
                        {values.type === 'recurring' && <GraphRecurringForm />}
                        <ConstantsFormLayout constants={values.constants} />
                        <Button.Group className="graph-form-button-group">
                            <ResetButton
                                type="danger"
                                icon="reload"
                                style={{ width: '50%' }}
                            >
                                Reset
                            </ResetButton>
                            <SubmitButton
                                type="primary"
                                icon="save"
                                disabled={false}
                                loading={isSubmitting}
                                style={{ width: '50%' }}
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </SubmitButton>
                        </Button.Group>
                    </FlexColumn>
                </Form>
            )}
        </Formik>
    );
};

const GraphRecurringForm: React.FC = () => (
    <>
        <Divider>Execution Type Options</Divider>
        <FlexRow gap={20}>
            <FormItem name="recurringOptions.frequency">
                <Select name="recurringOptions.frequency">
                    {Object.keys(repeatOptionMap).map(x => (
                        <Select.Option value={x} key={x}>
                            {repeatOptionMap[x]}
                        </Select.Option>
                    ))}
                </Select>
            </FormItem>
            <FormItem name="recurringOptions.every">
                <InputNumber
                    name="recurringOptions.every"
                    min={1}
                    defaultValue={1}
                />
            </FormItem>
        </FlexRow>
    </>
);

const GraphConstantsForm: React.FC<{ constants: IFormConstantData[] }> = ({
    constants,
}) => (
    <FieldArray
        name="constants"
        render={helpers => (
            <>
                <Divider>Constants</Divider>
                <FlexColumn className="constant-section">
                    {constants.map((constant, i) => (
                        <FlexRow
                            flex={100}
                            key={constant.key}
                            justifyContent="center"
                            alignContent="center"
                            gap={20}
                        >
                            <FormItem
                                name={`constants.${i}.label`}
                                label="Label"
                            >
                                <Input
                                    name={`constants.${i}.label`}
                                    placeholder="Label"
                                />
                            </FormItem>
                            <FormItem name={`constants.${i}.type`} label="Type">
                                <Select
                                    style={{
                                        minWidth: '175px',
                                    }}
                                    name={`constants.${i}.type`}
                                    placeholder="Type"
                                >
                                    {valueOptions.map((v, index) => (
                                        <Select.Option key={index} value={v}>
                                            {valueMap[v]}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </FormItem>
                            <FormItem
                                name={`constants.${i}.value`}
                                label="Value"
                            >
                                {constant.isSecret ? (
                                    <Input.Password
                                        name={`constants.${i}.value`}
                                    />
                                ) : (
                                    <ValueTypeControl
                                        name={`constants.${i}.value`}
                                        disabled={false}
                                        valueType={constant.type}
                                        {...constant}
                                    />
                                )}
                            </FormItem>
                            <FormItem
                                name={`constants.${i}.isSecret`}
                                label="Secret?"
                            >
                                <Checkbox name={`constants.${i}.isSecret`}>
                                    <Icon type="key" />
                                </Checkbox>
                            </FormItem>
                            <Button
                                icon="delete"
                                type="danger"
                                shape="circle-outline"
                                onClick={() => helpers.remove(i)}
                            />
                        </FlexRow>
                    ))}
                    <Button
                        type="dashed"
                        icon="plus"
                        onClick={() =>
                            helpers.push({
                                key: uuid(),
                                type: 'any',
                                isSecret: false,
                            })
                        }
                    >
                        Add
                    </Button>
                </FlexColumn>
            </>
        )}
    />
);
