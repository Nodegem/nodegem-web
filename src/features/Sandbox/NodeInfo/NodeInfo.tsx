import React, { useEffect, useState } from 'react';

import { Button, Divider } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';
import { FlexColumn } from 'components';
import { ValueTypeControl } from 'components/ValueTypeControl/ValueTypeControl';
import { FieldArray, Formik, FormikHelpers } from 'formik';
import { Form, FormItem, ResetButton, SubmitButton } from 'formik-antd';
import _ from 'lodash';
import * as Yup from 'yup';
import './NodeInfo.less';

interface INodeInfoProps {
    selectedNode: INodeUIData;
    onNodeValueChange: (node: INodeUIData, fields: IPortUIData[]) => void;
}

const NodeInfo: React.FC<INodeInfoProps> = ({
    selectedNode,
    onNodeValueChange,
}) => {
    const [nodeValueInputs, setValueInputs] = useState(
        selectedNode.valueInputs
    );

    useEffect(() => {
        setValueInputs(selectedNode.valueInputs);
    }, [selectedNode]);

    const containerClass = classNames({
        'node-info': true,
    });

    const handleSubmit = (
        values: INodeInfoFormValues,
        actions: FormikHelpers<INodeInfoFormValues>
    ) => {
        onNodeValueChange(selectedNode, values.valueInputs);
        actions.setSubmitting(false);
        setValueInputs(values.valueInputs);
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
            {nodeValueInputs && nodeValueInputs.any() && (
                <FlexColumn className="value-inputs">
                    <NodeInfoForm
                        valueInputs={nodeValueInputs}
                        handleSubmit={handleSubmit}
                    />
                </FlexColumn>
            )}
        </FlexColumn>
    );
};

interface INodeInfoFormValues {
    valueInputs: IPortUIData[];
}

interface INodeInfoFormProps {
    valueInputs: IPortUIData[];
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
    handleSubmit,
}) => {
    return (
        <Formik
            enableReinitialize
            initialValues={{
                valueInputs: valueInputs.map(x => ({
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
                                    className="value-input-controls"
                                >
                                    {valueInputs.map((vi, index) => (
                                        <FormItem
                                            key={index}
                                            name={`valueInputs.${index}.value`}
                                            label={vi.name}
                                        >
                                            <ValueTypeControl
                                                placeHolder="Value"
                                                name={`valueInputs.${index}.value`}
                                                disabled={vi.connected}
                                                valueType={vi.valueType}
                                            />
                                        </FormItem>
                                    ))}
                                </FlexColumn>
                            )}
                        />
                        <Button.Group>
                            <ResetButton
                                type="danger"
                                icon="reload"
                                style={{ width: '50%' }}
                            >
                                Undo
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
