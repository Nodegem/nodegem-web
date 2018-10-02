import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Card, Form, Input, Icon, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import ShowPasswordInput from '../../../components/ShowPasswordInput/ShowPasswordInput';

import './Register.scss';

@observer
class RegisterForm extends React.Component<FormComponentProps & RouteComponentProps<any>> {

    private submitForm = (e: React.FormEvent) => {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {

        });
    }

    private compareToFirstPassword = (rule, value, callback) => {
        callback();
    }

    private validatePassword = (rule, value, callback) => {
        callback();
    }

    private validateUsername= (rule, value, callback) => {
        console.log(rule, value, callback);
        callback();
    }

    public render() {

        const { getFieldDecorator } = this.props.form;
        const iconStyle : React.CSSProperties = { color: "rgba(0,0,0,.25)" };

        return (
            <Form onSubmit={this.submitForm} className="register-form">
                <FormItem hasFeedback>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: "Please input a username."}, { validator: this.validateUsername }]
                    })(
                        <Input prefix={<Icon type="user" style={iconStyle} />} placeholder="Username" />
                    )}
                </FormItem>
                <FormItem hasFeedback required>
                    {getFieldDecorator('email', {
                        rules: [
                            { type: 'email', message: "Plase input a valid email."},
                            { required: true, message: "Please input an email."}
                        ]
                    })(
                        <Input prefix={<Icon type="mail" style={iconStyle} />} placeholder="Email" />
                    )}
                </FormItem>
                <FormItem hasFeedback>
                    {getFieldDecorator('firstName')(
                        <Input placeholder="First Name" />
                    )}
                </FormItem>
                <FormItem hasFeedback>
                    {getFieldDecorator('lastName')(
                        <Input placeholder="Last Name" />
                    )}
                </FormItem>
                <FormItem hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: "Please input a password."}, { validator: this.validatePassword }]
                    })(
                        <ShowPasswordInput />
                    )}
                </FormItem>
                <FormItem hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [{ required: true, message: "Please input a password."}, { validator: this.compareToFirstPassword }]
                    })(
                        <ShowPasswordInput placeHolder="Confirm Password" />
                    )}
                </FormItem>
                <Button type="primary" htmlType="submit" className="register-form-button">Register</Button>
            </Form>
        );
    }

}

const RegisterFormView = withRouter(Form.create()(RegisterForm));

const RegisterView = () =>
    <div className="register-form-container">
        <Card
            className="register-card-container"
            title="Register">
            <RegisterFormView />
        </Card>
    </div>

export default RegisterView;