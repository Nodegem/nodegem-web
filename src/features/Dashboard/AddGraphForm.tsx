import React from "react";
import { Form, Input, Row, Col, Modal } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { withRouter, RouteComponentProps } from "react-router";
import { FormComponentProps } from "antd/lib/form";
import { WrappedFormUtils } from "antd/lib/form/Form";

interface AddGraphFormProps extends FormComponentProps {
    visible: boolean,
    onSubmit: (success: boolean, values: any) => void,
    onCancel: () => void;
}

class AddGraphForm extends React.Component<AddGraphFormProps> {

    private onSubmit = (e) => {

        const { form } = this.props;

        form.validateFields((err, values) => {

            if(!err) {
                this.props.onSubmit(true, values);
            } else {
                this.props.onSubmit(false, values);
            }

        });

    }

    public render() {

        const { form, visible, onCancel } = this.props;
        const { getFieldDecorator } = form;

        return (
            <div>
                <Modal title="Create Graph" visible={visible} okText="Create" onCancel={onCancel} onOk={this.onSubmit}>
                    <Form>
                        <FormItem label="Name" >
                            {
                                getFieldDecorator('Name', {
                                    rules: [{
                                        required: true
                                    }]
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                        <FormItem label="Description">
                            {
                                getFieldDecorator('Description')(
                                    <Input />
                                )
                            }
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }

}

export default Form.create()(AddGraphForm);