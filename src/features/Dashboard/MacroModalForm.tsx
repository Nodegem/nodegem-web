import { Form, Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import ModalForm, { ModalFormProps } from 'src/components/ModalForm/ModalForm';
import { DashboardStore, ModalFormType } from 'src/features/Dashboard/dashboard-store';
import { MacroStore } from 'src/stores/macro-store';

interface ModalProps extends ModalFormProps {
    dashboardStore?: DashboardStore;
    macroStore?: MacroStore;
}

@inject('dashboardStore')
@observer
class MacroModalForm extends React.Component<ModalProps> {

    private type: ModalFormType = "macro";
    private formRef: Form;

    handleSubmit = async () => {
        const { dashboardStore } = this.props;
        const { form } = this.formRef.props;

        const { modalOptions } = dashboardStore!;

        form!.validateFields(async (err, values) => {

            if(err) {
                return;
            }

            // if(modalOptions.graph.editMode) {
            //     await dashboardStore!.updateGraph({ ...modalOptions.graph.data, ...values });
            // } else {
            //     await dashboardStore!.createNewGraph(values);
            // }

            form!.resetFields();
            this.props.dashboardStore!.closeModal(this.type);
        });
    }

    handleCancel = () => {
        const { form } = this.formRef.props;

        form!.resetFields();
        this.props.dashboardStore!.closeModal(this.type);
    }

    public render() {

        const { children, dashboardStore, ...rest } = this.props;
        const { modalOptions } = dashboardStore!;

        const options = modalOptions[this.type];
        const modalTitle = options.editMode ? "Edit Macro" : "Add Macro";
        const modalOkButton = options.editMode ? "Save" : "Add";

        const model = options.data;

        return (
            <ModalForm wrappedComponentRef={f => this.formRef = f!}
                modalProps={{title: modalTitle, okText: modalOkButton, onOk: this.handleSubmit, onCancel: this.handleCancel}} 
                visible={options.open} {...rest}>
                {
                    fd => (
                        <>
                            <FormItem label="Name">
                                {fd<Graph>('name', {
                                    initialValue: model['name'], rules: [{ required: true, message: "Name is required" }]
                                })(<Input />)}
                            </FormItem>
                            <FormItem label="Description" required>
                                {fd<Graph>('description', {
                                    initialValue: model['description'], rules: [{ required: true, message: "Description is required" }]
                                })(<Input />)}
                            </FormItem>
                        </>
                    )
                }
            </ModalForm>
        ); 
    }

}

export default MacroModalForm;