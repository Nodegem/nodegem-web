import * as React from 'react';
import ModalForm, { ModalVisibilityProps, ModalFormProps } from 'src/components/ModalForm/ModalForm';
import FormItem from 'antd/lib/form/FormItem';
import { Input } from 'antd';

export default class ModalMacroForm extends React.Component<ModalFormProps> {

    static defaultProps = {
        model: {}
    }

    public render() {

        const { model } = this.props;
        const isEditing = Object.keys(model).length > 0 ? "Edit" : "Add";

        return (
            <ModalForm modalProps={{ title: `${isEditing} Macro` }} {...this.props} >
                { 
                    getFieldDecorator => 
                        (
                            <FormItem required>
                                {
                                    getFieldDecorator<Graph>('name')(
                                        <Input />
                                    )
                                }
                            </FormItem>
                        )
                }
            </ModalForm>
        );
    }

}