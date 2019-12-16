import { Button } from 'antd';
import { FlexColumn } from 'components';
import { Form, Formik, FormikHelpers } from 'formik';
import { Select, SubmitButton } from 'formik-antd';
import React from 'react';

export interface IMacroRunFormValues {
    flowInputField: FlowInputFieldDto;
}

interface IMacroRunFormProps {
    flowInputs: FlowInputFieldDto[];
    valueInputs: ValueOutputFieldDto[];
    handleRun: (
        values: IMacroRunFormValues,
        actions: FormikHelpers<IMacroRunFormValues>
    ) => Promise<void>;
    handleCancel: () => void;
}

export const MacroRunForm: React.FC<IMacroRunFormProps> = ({
    flowInputs,
    handleRun,
    handleCancel,
}) => {
    return (
        <Formik
            initialValues={{
                flowInputField: flowInputs[0],
            }}
            onSubmit={handleRun}
            render={({ isSubmitting }) => (
                <Form>
                    <FlexColumn gap={20}>
                        <Select name="flowInputField.key">
                            {flowInputs.map((fi, index) => (
                                <Select.Option key={index} value={fi.key}>
                                    {fi.label}
                                </Select.Option>
                            ))}
                        </Select>
                        <Button.Group>
                            <Button
                                icon="cancel"
                                disabled={false}
                                style={{ width: '50%' }}
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                            <SubmitButton
                                type="primary"
                                disabled={false}
                                style={{ width: '50%' }}
                            >
                                Run
                            </SubmitButton>
                        </Button.Group>
                    </FlexColumn>
                </Form>
            )}
        />
    );
};
