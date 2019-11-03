import { Button, Collapse, Divider, Icon } from 'antd';
import { FlexColumn, FlexRow, ValueTypeControl } from 'components';
import { FieldArray, Formik, FormikHelpers } from 'formik';
import {
    Form,
    FormItem,
    Input,
    ResetButton,
    Select,
    SubmitButton,
} from 'formik-antd';
import { uuid } from 'lodash-uuid';
import React, { useState } from 'react';
import * as Yup from 'yup';
import '../../types/yup.ts';

import { valueMap } from 'utils';
import './MacroForm.less';

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

export interface IMacroFormValues {
    name: string;
    description?: string;
    flowInputs: IIOFormData[];
    flowOutputs: IIOFormData[];
    valueInputs: IValueInputFormData[];
    valueOutputs: IValueOutputFormData[];
}

interface IIOFormData {
    key: string;
    label: string;
}

interface IValueInputFormData extends IIOFormData {
    defaultValue: any;
    type: ValueType;
}

interface IValueOutputFormData extends IIOFormData {
    type: ValueType;
}

const validationSchema = Yup.object().shape<IMacroFormValues>({
    name: Yup.string().required('Name is required'),
    description: Yup.string().notRequired(),
    flowInputs: Yup.array()
        .of(
            Yup.object().shape<IIOFormData>({
                key: Yup.string().required('Key is required'),
                label: Yup.string().required('Label is required'),
            })
        )
        .min(1, 'At least one flow input is required'),
    flowOutputs: Yup.array()
        .of(
            Yup.object().shape<IIOFormData>({
                key: Yup.string().required('Key is required'),
                label: Yup.string().required('Label is required'),
            })
        )
        .min(1, 'At least one flow output is required'),
    valueInputs: Yup.array().of(
        Yup.object().shape<IValueInputFormData>({
            key: Yup.string().required('Key is required'),
            label: Yup.string().required('Label is required'),
            type: Yup.mixed<ValueType>()
                .oneOf(valueOptions)
                .required('A value type is required'),
            defaultValue: Yup.mixed().when('type', {
                is: 'url',
                then: Yup.string()
                    .url('Invalid Url')
                    .notRequired(),
                otherwise: Yup.mixed().notRequired(),
            }),
        })
    ),
    valueOutputs: Yup.array().of(
        Yup.object().shape<IValueOutputFormData>({
            key: Yup.string().required('Key is required'),
            label: Yup.string().required('Label is required'),
            type: Yup.mixed<ValueType>()
                .oneOf(valueOptions)
                .required('A value type is required'),
        })
    ),
});

interface IMacroFormProps {
    initialValue?: IMacroFormValues;
    handleSubmit: (
        values: IMacroFormValues,
        actions: FormikHelpers<IMacroFormValues>
    ) => void;
}

export const MacroForm: React.FC<IMacroFormProps> = ({
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
                flowInputs: (initialValue && initialValue.flowInputs) || [
                    { key: uuid(), label: 'In' },
                ],
                flowOutputs: (initialValue && initialValue.flowOutputs) || [
                    { key: uuid(), label: 'Out' },
                ],
                valueInputs: (initialValue && initialValue.valueInputs) || [],
                valueOutputs: (initialValue && initialValue.valueOutputs) || [],
            }}
            render={({ isSubmitting, values }) => (
                <Form>
                    <FlexColumn className="macro-form" gap={15}>
                        <FormItem name="name" label="Name" required>
                            <Input name="name" placeholder="Name" />
                        </FormItem>
                        <FormItem name="description" label="Description">
                            <Input.TextArea
                                name="description"
                                placeholder="Description"
                            />
                        </FormItem>
                        <FormIO {...values} />
                        <Button.Group>
                            <ResetButton
                                type="danger"
                                icon="reload"
                                disabled={false}
                                style={{ width: '50%' }}
                            >
                                Reset
                            </ResetButton>
                            <SubmitButton
                                type="primary"
                                icon="save"
                                disabled={false}
                                style={{ width: '50%' }}
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </SubmitButton>
                        </Button.Group>
                    </FlexColumn>
                </Form>
            )}
        />
    );
};

interface IAddItemProps {
    onClick: () => void;
}

const AddItem: React.FC<IAddItemProps> = ({ onClick }) => (
    <Button block type="dashed" onClick={onClick}>
        <Icon type="plus" /> Add Field
    </Button>
);

interface IFormIOProps {
    flowInputs: IIOFormData[];
    flowOutputs: IIOFormData[];
    valueInputs: IValueInputFormData[];
    valueOutputs: IValueOutputFormData[];
}

const FormIO: React.FC<IFormIOProps> = ({
    flowInputs,
    flowOutputs,
    valueInputs,
    valueOutputs,
}) => {
    const [activeKey, setActiveKey] = useState<string | string[] | undefined>([
        '1',
        '2',
    ]);
    const [inputKey, setInputKey] = useState<string | string[] | undefined>(
        '1'
    );
    const [outputKey, setOutputKey] = useState<string | string[] | undefined>(
        '1'
    );

    return (
        <>
            <Divider>Inputs / Outputs</Divider>
            <Collapse
                className="io-fields"
                activeKey={activeKey}
                onChange={key => setActiveKey(key)}
            >
                <Collapse.Panel header="Inputs" key="1">
                    <Collapse
                        bordered={false}
                        activeKey={inputKey}
                        onChange={key => setInputKey(key)}
                    >
                        <Collapse.Panel header="Flow" key="1">
                            <FieldArray
                                name="flowInputs"
                                render={helpers => (
                                    <FlexColumn gap={20}>
                                        {flowInputs.map((fi, index) => (
                                            <FlexRow gap={30} key={fi.key}>
                                                <FormItem
                                                    name={`flowInputs.${index}.label`}
                                                >
                                                    <Input
                                                        name={`flowInputs.${index}.label`}
                                                        placeholder="Label"
                                                    />
                                                </FormItem>
                                                <Button
                                                    disabled={index === 0}
                                                    icon="delete"
                                                    type="danger"
                                                    shape="circle-outline"
                                                    onClick={() =>
                                                        helpers.remove(index)
                                                    }
                                                />
                                            </FlexRow>
                                        ))}
                                        <AddItem
                                            onClick={() =>
                                                helpers.push({ key: uuid() })
                                            }
                                        />
                                    </FlexColumn>
                                )}
                            />
                        </Collapse.Panel>
                        <Collapse.Panel header="Value" key="2">
                            <FieldArray
                                name="valueInputs"
                                render={helpers => (
                                    <FlexColumn gap={20}>
                                        {valueInputs.map((vi, index) => (
                                            <FlexRow gap={30} key={vi.key}>
                                                <FormItem
                                                    name={`valueInputs.${index}.label`}
                                                >
                                                    <Input
                                                        name={`valueInputs.${index}.label`}
                                                        placeholder="Label"
                                                    />
                                                </FormItem>
                                                <FormItem
                                                    name={`valueInputs.${index}.type`}
                                                >
                                                    <Select
                                                        style={{
                                                            minWidth: '175px',
                                                        }}
                                                        name={`valueInputs.${index}.type`}
                                                        placeholder="Type"
                                                    >
                                                        {valueOptions.map(
                                                            (v, vIndex) => (
                                                                <Select.Option
                                                                    key={vIndex}
                                                                    value={v}
                                                                >
                                                                    {
                                                                        valueMap[
                                                                            v
                                                                        ]
                                                                    }
                                                                </Select.Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormItem>
                                                <FormItem
                                                    name={`valueInputs.${index}.defaultValue`}
                                                >
                                                    <ValueTypeControl
                                                        placeHolder="Value"
                                                        name={`valueInputs.${index}.defaultValue`}
                                                        disabled={false}
                                                        valueType={vi.type}
                                                        {...vi}
                                                    />
                                                </FormItem>
                                                <Button
                                                    icon="delete"
                                                    type="danger"
                                                    shape="circle-outline"
                                                    onClick={() =>
                                                        helpers.remove(index)
                                                    }
                                                />
                                            </FlexRow>
                                        ))}
                                        <AddItem
                                            onClick={() =>
                                                helpers.push({
                                                    key: uuid(),
                                                    type: 'any',
                                                })
                                            }
                                        />
                                    </FlexColumn>
                                )}
                            />
                        </Collapse.Panel>
                    </Collapse>
                </Collapse.Panel>
                <Collapse.Panel header="Outputs" key="2">
                    <Collapse
                        bordered={false}
                        activeKey={outputKey}
                        onChange={key => setOutputKey(key)}
                    >
                        <Collapse.Panel header="Flow" key="1">
                            <FieldArray
                                name="flowOutputs"
                                render={helpers => (
                                    <FlexColumn>
                                        {flowOutputs.map((fo, index) => (
                                            <FlexRow gap={30} key={fo.key}>
                                                <FormItem
                                                    name={`flowOutputs.${index}.label`}
                                                >
                                                    <Input
                                                        name={`flowOutputs.${index}.label`}
                                                        placeholder="Label"
                                                    />
                                                </FormItem>
                                                <Button
                                                    disabled={index === 0}
                                                    icon="delete"
                                                    type="danger"
                                                    shape="circle-outline"
                                                    onClick={() =>
                                                        helpers.remove(index)
                                                    }
                                                />
                                            </FlexRow>
                                        ))}
                                        <AddItem
                                            onClick={() =>
                                                helpers.push({ key: uuid() })
                                            }
                                        />
                                    </FlexColumn>
                                )}
                            />
                        </Collapse.Panel>
                        <Collapse.Panel header="Value" key="2">
                            <FieldArray
                                name="valueOutputs"
                                render={helpers => (
                                    <FlexColumn>
                                        {valueOutputs.map((vo, index) => (
                                            <FlexRow gap={30} key={vo.key}>
                                                <FormItem
                                                    name={`valueOutputs.${index}.label`}
                                                >
                                                    <Input
                                                        name={`valueOutputs.${index}.label`}
                                                        placeholder="Label"
                                                    />
                                                </FormItem>
                                                <FormItem
                                                    name={`valueInputs.${index}.type`}
                                                >
                                                    <Select
                                                        name={`valueOutputs.${index}.type`}
                                                        placeholder="Type"
                                                    >
                                                        {valueOptions.map(
                                                            (v, vIndex) => (
                                                                <Select.Option
                                                                    key={vIndex}
                                                                    value={v}
                                                                >
                                                                    {
                                                                        valueMap[
                                                                            v
                                                                        ]
                                                                    }
                                                                </Select.Option>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormItem>
                                                <Button
                                                    icon="delete"
                                                    type="danger"
                                                    shape="circle-outline"
                                                    onClick={() =>
                                                        helpers.remove(index)
                                                    }
                                                />
                                            </FlexRow>
                                        ))}
                                        <AddItem
                                            onClick={() =>
                                                helpers.push({
                                                    key: uuid(),
                                                    type: 'any',
                                                })
                                            }
                                        />
                                    </FlexColumn>
                                )}
                            />
                        </Collapse.Panel>
                    </Collapse>
                </Collapse.Panel>
            </Collapse>
        </>
    );
};
