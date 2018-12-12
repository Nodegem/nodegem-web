import * as React from 'react';
import { Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import Form, { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { ModalProps } from 'antd/lib/modal';

type FieldDecorator = <T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions) => (node: React.ReactNode) => React.ReactNode;

export interface ModalFormProps {
    modalProps?: ModalProps;
}

class ModalForm extends React.Component<ModalFormProps & { visible: boolean, children: (getFieldDecorator: FieldDecorator) => React.ReactNode }
    & FormComponentProps> {

    public render() {

        const { children, modalProps, visible, form, ...rest } = this.props;
        const { getFieldDecorator } = form; 

        return (
            <Modal
                visible={visible}
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