import * as React from 'react';
import { Input } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import ModalForm, { ModalFormProps } from 'src/components/ModalForm/ModalForm';

export default class ModalGraphForm extends React.Component<ModalFormProps> {

    static defaultProps = {
        model: {}
    }

    public render() {

        let { model } = this.props;
        const isEditing = Object.keys(model).length > 0 ? "Edit" : "Add";

        return (
            <ModalForm modalProps={{ title: `${isEditing} Graph` }} {...this.props}>
                { 
                    getFieldDecorator => 
                        (
                            <>
                                <FormItem label="Name" required>
                                    {
                                        getFieldDecorator<Graph>('name', {
                                            initialValue: model.name
                                        })(
                                            <Input />
                                        )
                                    }
                                </FormItem>
                                <FormItem label="Description">
                                    {
                                        getFieldDecorator<Graph>('description')(
                                            <Input />
                                        )
                                    }
                                </FormItem>
                            </>
                        )
                }
            </ModalForm>
        );
    }

}