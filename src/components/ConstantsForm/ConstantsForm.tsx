import React from 'react';
import {
    FormItem,
    Input,
    Checkbox,
    Select,
    Form,
    ResetButton,
    SubmitButton,
} from 'formik-antd';
import { ValueTypeControl } from 'components';
import { Icon, List, Button } from 'antd';
import { valueMap } from 'utils';
import * as Yup from 'yup';
import { Formik, FieldArray, FormikHelpers } from 'formik';
import { uuid } from 'lodash-uuid';

import './ConstantsForm.less';

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

const constantFormItems = (constant: IFormConstantData, i: number) => [
    <FormItem name={`constants.${i}.label`} label="Label">
        <Input name={`constants.${i}.label`} placeholder="Label" />
    </FormItem>,
    <FormItem name={`constants.${i}.type`} label="Type">
        <Select name={`constants.${i}.type`} placeholder="Type">
            {valueOptions.map((v, index) => (
                <Select.Option key={index} value={v}>
                    {valueMap[v]}
                </Select.Option>
            ))}
        </Select>
    </FormItem>,
    <FormItem
        className="secret-form-control"
        name={`constants.${i}.isSecret`}
        label="Secret?"
    >
        <Checkbox name={`constants.${i}.isSecret`}>
            <Icon type="key" />
        </Checkbox>
    </FormItem>,
    <FormItem name={`constants.${i}.value`} label="Value">
        {constant.isSecret ? (
            <Input.Password name={`constants.${i}.value`} />
        ) : (
            <ValueTypeControl
                name={`constants.${i}.value`}
                disabled={false}
                valueType={constant.type}
                {...constant}
            />
        )}
    </FormItem>,
];

const constantSchema = Yup.object().shape({
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
});

interface IConstantsLayoutProps {
    constants: IConstant[];
}

interface IConstantsFormProps extends IConstantsLayoutProps {
    onSubmit: (
        values: { constants: IConstant[] },
        formikHelpers: FormikHelpers<{ constants: IConstant[] }>
    ) => Promise<void>;
}

export const ConstantsFormLayout: React.FC<IConstantsLayoutProps> = ({
    constants,
}) => {
    return (
        <FieldArray
            name="constants"
            render={helpers => (
                <>
                    <List
                        size="small"
                        locale={{
                            emptyText: ' ',
                        }}
                        grid={{ gutter: 16, column: 1 }}
                        dataSource={constants}
                        renderItem={(constant, i) => {
                            return (
                                <List.Item>
                                    <List
                                        size="small"
                                        className="constant-container"
                                        bordered
                                        grid={{
                                            gutter: 10,
                                            sm: 1,
                                            md: 1,
                                            lg: 4,
                                        }}
                                        dataSource={constantFormItems(
                                            constant,
                                            i
                                        )}
                                        renderItem={item => (
                                            <List.Item>{item}</List.Item>
                                        )}
                                    />
                                    <Button
                                        type="link"
                                        className="remove-constant"
                                        icon="close"
                                        onClick={() => helpers.remove(i)}
                                    />
                                </List.Item>
                            );
                        }}
                    />
                    <Button
                        block
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
                        Add Constant
                    </Button>
                </>
            )}
        />
    );
};

export const ConstantsForm: React.FC<IConstantsFormProps> = ({
    constants,
    onSubmit,
}) => {
    return (
        <Formik
            enableReinitialize
            initialValues={{
                constants: constants,
            }}
            validationSchema={constantSchema}
            onSubmit={onSubmit}
        >
            {({ values, isSubmitting }) => (
                <Form>
                    <ConstantsFormLayout constants={values.constants} />
                    <Button.Group
                        style={{
                            width: '100%',
                            marginTop: '20px',
                        }}
                    >
                        <ResetButton
                            type="danger"
                            className="reset-button"
                            icon="reload"
                            style={{ width: '50%' }}
                        >
                            Reset
                        </ResetButton>
                        <SubmitButton
                            disabled={false}
                            loading={isSubmitting}
                            style={{ width: '50%' }}
                            icon="save"
                            htmlType="submit"
                        >
                            Save
                        </SubmitButton>
                    </Button.Group>
                </Form>
            )}
        </Formik>
    );
};
