import { Form, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import ModalForm, { ModalFormProps } from 'src/components/ModalForm/ModalForm';
import { MacroModalStore } from './macro-modal-store';

interface ModalProps extends ModalFormProps {
    macroModalStore?: MacroModalStore;
}

@inject('macroModalStore')
@observer
class MacroModalForm extends React.Component<ModalProps> {
    private formRef: Form;

    handleSubmit = async () => {
        const { macroModalStore } = this.props;
        const { form } = this.formRef.props;

        form!.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            await this.props.macroModalStore!.saveMacro(values);

            form!.resetFields();
            this.props.macroModalStore!.closeModal();
        });
    };

    handleCancel = () => {
        const { form } = this.formRef.props;

        form!.resetFields();
        this.props.macroModalStore!.closeModal();
    };

    public render() {
        const { children, macroModalStore, ...rest } = this.props;
        const { saving, editMode, data, isVisible } = macroModalStore!;

        const modalTitle = editMode ? 'Edit Macro' : 'Add Macro';

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
                            })(<Input />)}
                        </FormItem>
                    </>
                )}
            </ModalForm>
        );
    }
}

export default MacroModalForm;
