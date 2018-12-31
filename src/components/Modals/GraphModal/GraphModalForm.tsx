import { Form, Input, Divider } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import ModalForm, { ModalFormProps } from 'src/components/ModalForm/ModalForm';

import { GraphModalStore } from './graph-modal-store';
import EnvironmentVariables from 'src/components/EnvironmentVariables/EnvironmentVariables';

interface ModalProps extends ModalFormProps {
    graphModalStore?: GraphModalStore;
}

@inject('graphModalStore')
@observer
class GraphModalForm extends React.Component<ModalProps> {
    private formRef: Form;

    handleSubmit = async () => {
        const { graphModalStore } = this.props;
        const { form } = this.formRef.props;

        form!.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            await graphModalStore!.saveGraph(values);

            form!.resetFields();
            graphModalStore!.closeModal();
        });
    };

    handleCancel = () => {
        const { form } = this.formRef.props;

        form!.resetFields();
        this.props.graphModalStore!.closeModal();
    };

    public render() {
        const { children, graphModalStore, ...rest } = this.props;
        const { saving, editMode, data, isVisible } = graphModalStore!;

        const modalTitle = editMode ? 'Edit Graph' : 'Add Graph';

        let okButton = '';
        if (saving) {
            okButton = editMode ? 'Saving' : 'Adding';
        } else {
            okButton = editMode ? 'Save' : 'Add';
        }

        return (
            <ModalForm
                wrappedComponentRef={f => (this.formRef = f!)}
                modalProps={{
                    title: modalTitle,
                    okText: okButton,
                    okButtonProps: { loading: saving },
                    onOk: this.handleSubmit,
                    onCancel: this.handleCancel,
                    width: 700,
                }}
                visible={isVisible}
                {...rest}
            >
                {fd => (
                    <>
                        <FormItem label="Name">
                            {fd<Graph>('name', {
                                initialValue: data.name,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Name is required',
                                    },
                                ],
                            })(<Input />)}
                        </FormItem>
                        <FormItem label="Description" required>
                            {fd<Graph>('description', {
                                initialValue: data.description,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Description is required',
                                    },
                                ],
                            })(
                                <TextArea
                                    autosize={{ minRows: 3, maxRows: 8 }}
                                />
                            )}
                        </FormItem>
                        <Divider>Graph Constants</Divider>
                        <EnvironmentVariables />
                    </>
                )}
            </ModalForm>
        );
    }
}

export default GraphModalForm;
