import React, { useEffect, useState } from 'react';

import { Button, Divider, Icon } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';
import { FlexColumn } from 'components';
import { ValueTypeControl } from 'components/ValueTypeControl/ValueTypeControl';
import { FieldArray, Formik, FormikHelpers } from 'formik';
import { Form, FormItem, ResetButton, Select, SubmitButton } from 'formik-antd';
import _ from 'lodash';
import { valueMap } from 'utils';
import * as Yup from 'yup';
import './NodeInfo.less';

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

interface INodeInfoProps {
    selectedNode: INodeUIData;
    onNodeValueChange: (
        node: INodeUIData,
        fields: IPortUIData[],
        type: 'input' | 'output'
    ) => void;
}

const NodeInfo: React.FC<INodeInfoProps> = ({
    selectedNode,
    onNodeValueChange,
}) => {
    const [nodeValueInputs, setValueInputs] = useState(
        selectedNode.valueInputs
    );
    const [nodeValueOutputs, setValueOutputs] = useState(
        selectedNode.valueOutputs
    );

    useEffect(() => {
        setValueInputs(selectedNode.valueInputs);
        setValueOutputs(selectedNode.valueOutputs);
    }, [selectedNode]);

    const containerClass = classNames({
        'node-info': true,
    });

    const handleSubmit = (
        values: INodeInfoFormValues,
        actions: FormikHelpers<INodeInfoFormValues>
    ) => {
        console.log(values);
        onNodeValueChange(selectedNode, values.valueInputs, 'input');
        onNodeValueChange(selectedNode, values.valueOutputs, 'output');
        actions.setSubmitting(false);
        setValueInputs(values.valueInputs);
        setValueOutputs(values.valueOutputs);
    };

    return (
        <FlexColumn className={containerClass} gap={20}>
            <FlexColumn className="node-info-title" flex="0 1 auto">
                <p className="header">{selectedNode.title}</p>
            </FlexColumn>
            <Divider />
            <FlexColumn className="node-info-description" flex="0 1 auto">
                <p className="header underline">Description:</p>
                <Paragraph>{selectedNode.description || 'N/A'}</Paragraph>
            </FlexColumn>
            {((nodeValueInputs && nodeValueInputs.any()) ||
                (nodeValueOutputs && nodeValueInputs.any())) && (
                <FlexColumn className="value-inputs">
                    <NodeInfoForm
                        valueInputs={nodeValueInputs}
                        valueOutputs={nodeValueOutputs}
                        handleSubmit={handleSubmit}
                    />
                </FlexColumn>
            )}
        </FlexColumn>
    );
};

interface INodeInfoFormValues {
    valueInputs: IPortUIData[];
    valueOutputs: IPortUIData[];
}

interface INodeInfoFormProps {
    valueInputs: IPortUIData[];
    valueOutputs: IPortUIData[];
    handleSubmit: (
        values: INodeInfoFormValues,
        actions: FormikHelpers<INodeInfoFormValues>
    ) => void;
}

const validationScheme = Yup.object().shape({
    valueInputs: Yup.array().of(
        Yup.object().shape<{ value: any }>({
            value: Yup.mixed().when('valueType', {
                is: 'url',
                then: Yup.string()
                    .url('Invalid Url')
                    .notRequired(),
                otherwise: Yup.mixed().notRequired(),
            }),
        })
    ),
});

const NodeInfoForm: React.FC<INodeInfoFormProps> = ({
    valueInputs,
    valueOutputs,
    handleSubmit,
}) => {
    const getPortLabel = (
        port: IPortUIData,
        list: IPortUIData[],
        index: number
    ) => {
        if (!port.indefinite) {
            return port.name;
        }

        const startIndefiniteIndex = list.findIndex(x => x.indefinite);
        return `${port.name}[${index - startIndefiniteIndex}]`;
    };

    return (
        <Formik
            enableReinitialize
            initialValues={{
                valueInputs: valueInputs.map(x => ({
                    ...x,
                    value: x.value || x.defaultValue,
                    valueType: x.valueType!,
                })),
                valueOutputs: valueOutputs.map(x => ({
                    ...x,
                    value: x.value || x.defaultValue,
                    valueType: x.valueType!,
                })),
            }}
            validationSchema={validationScheme}
            onSubmit={handleSubmit}
            render={({ isSubmitting }) => (
                <Form className="node-info-form">
                    <FlexColumn gap={20}>
                        <Divider />
                        <FieldArray
                            name="valueInputs"
                            render={() => (
                                <FlexColumn
                                    gap={20}
                                    flex="1 1 auto"
                                    className="value-input-controls"
                                >
                                    {valueInputs.map((vi, index) => (
                                        <FormItem
                                            key={index}
                                            name={`valueInputs.${index}.value`}
                                            label={getPortLabel(
                                                vi,
                                                valueInputs,
                                                index
                                            )}
                                        >
                                            {vi.connected || !vi.isEditable ? (
                                                !vi.isEditable ? (
                                                    <span className="is-connected">
                                                        Not Editable
                                                    </span>
                                                ) : (
                                                    <span className="is-connected">
                                                        Connected
                                                        <Icon type="link" />
                                                    </span>
                                                )
                                            ) : (
                                                <ValueTypeControl
                                                    placeHolder="Value"
                                                    name={`valueInputs.${index}.value`}
                                                    disabled={
                                                        vi.connected ||
                                                        !vi.isEditable
                                                    }
                                                    valueType={vi.valueType}
                                                />
                                            )}
                                        </FormItem>
                                    ))}
                                </FlexColumn>
                            )}
                        />
                        {valueOutputs.filter(x => x.indefinite).any() && (
                            <FieldArray
                                name="valueOutputs"
                                render={() => (
                                    <FlexColumn
                                        gap={20}
                                        className="value-output-controls"
                                    >
                                        {valueOutputs.map(
                                            (vo, index) =>
                                                vo.indefinite && (
                                                    <React.Fragment key={index}>
                                                        <FormItem
                                                            name={`valueOutputs.${index}.value`}
                                                            label={`${getPortLabel(
                                                                vo,
                                                                valueOutputs,
                                                                index
                                                            )} Key`}
                                                        >
                                                            <ValueTypeControl
                                                                placeHolder="Value"
                                                                name={`valueOutputs.${index}.value`}
                                                                disabled={false}
                                                                valueType={
                                                                    'text'
                                                                }
                                                            />
                                                        </FormItem>
                                                        <FormItem
                                                            key={index}
                                                            name={`valueOutputs.${index}.valueType`}
                                                            label={`${getPortLabel(
                                                                vo,
                                                                valueOutputs,
                                                                index
                                                            )} Type`}
                                                        >
                                                            <Select
                                                                style={{
                                                                    minWidth:
                                                                        '175px',
                                                                }}
                                                                name={`valueOutputs.${index}.valueType`}
                                                                placeholder="Type"
                                                            >
                                                                {valueOptions.map(
                                                                    (
                                                                        v,
                                                                        vIndex
                                                                    ) => (
                                                                        <Select.Option
                                                                            key={
                                                                                vIndex
                                                                            }
                                                                            value={
                                                                                v
                                                                            }
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
                                                    </React.Fragment>
                                                )
                                        )}
                                    </FlexColumn>
                                )}
                            />
                        )}

                        <Button.Group>
                            <ResetButton
                                type="danger"
                                icon="reload"
                                style={{ width: '50%' }}
                            >
                                Reset
                            </ResetButton>
                            <SubmitButton
                                disabled={false}
                                type="primary"
                                icon="save"
                                loading={isSubmitting}
                                style={{ width: '50%' }}
                            >
                                Save
                            </SubmitButton>
                        </Button.Group>
                    </FlexColumn>
                </Form>
            )}
        />
    );
};

export default NodeInfo;
