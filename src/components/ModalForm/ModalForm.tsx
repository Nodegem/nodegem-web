import * as React from 'react';
import { Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Form, { GetFieldDecoratorOptions, FormProps, WrappedFormUtils } from 'antd/lib/form/Form';
import { ModalProps } from 'antd/lib/modal';

type FieldDecorator = <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions) => (node: React.ReactNode) => React.ReactNode;

export interface ModalVisibilityProps {
    visible: boolean;
}

export interface ModalFormProps extends ModalVisibilityProps {
    modalkey: string;
    model: any;
    onSuccess: (modalKey: string, values, resetFields: (names?: string[]) => void) => void;
    onFailure: (modalKey: string, values, err, resetFields: (names?: string[]) => void) => void;
    onCancel?: (modalKey: string) => void;
}

class ModalForm extends React.Component<ModalFormProps & 
    { modalProps?: ModalProps, children: (getFieldDecorator: FieldDecorator) => React.ReactNode } & FormComponentProps> {

    private onSubmit = () => {

        const { form, modalkey, onSuccess, onFailure } = this.props;

        form.validateFields((err, values) => {
            if(!err) {
                onSuccess(modalkey, values, form.resetFields);
            } else {
                onFailure(modalkey, values, err, form.resetFields);
            }
        });

    }

    private onCancel = () => {
        if(this.props.onCancel) {
            this.props.onCancel(this.props.modalkey);
        }

        this.props.form.resetFields();
    }

    public render() {

        const { children, modalProps, visible, onSuccess, onFailure, onCancel, form, ...rest } = this.props;
        const { getFieldDecorator } = form; 

        return (
            <Modal
                visible={visible}
                onOk={this.onSubmit}
                onCancel={this.onCancel}
                {...modalProps}
            >
                <Form {...rest} >
                    {children(getFieldDecorator)}
                </Form>
            </Modal>
        )

    }

}

export default Form.create()(ModalForm);