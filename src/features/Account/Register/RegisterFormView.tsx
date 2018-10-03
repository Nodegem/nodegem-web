import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Card, Form, Input, Icon, Button } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';

import './Register.scss';
import classNames from 'classnames';
import { registerService } from './register-service';
import { userStore } from '../../../stores/user-store';
import history from '../../../utils/history';

interface RegisterFormState {
    isDirty: boolean;
    showPassword: boolean;
}

@observer
class RegisterForm extends React.Component<FormComponentProps & RouteComponentProps<any>, RegisterFormState> {

    state = {
        isDirty: false,
        showPassword: false
    }

    private onLockClick = () => {
        this.setState({ showPassword: !this.state.showPassword });
    }

    private handleBlur = (e) => {
        const value = e.target.value;
        this.setState({ isDirty: this.state.isDirty || !!value });
    }

    private submitForm = (e: React.FormEvent) => {

        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if(!err) {
                registerService.registerUser({ userName: values.username, email: values.email,
                    password: values.password, firstName: values.firstName, lastName: values.lastName })
                    .then(data => {
                        userStore.setToken(data.token);
                        userStore.setUserData(data.user)
                        history.push("/");
                    }).catch(reason => {
                        console.log(reason);
                    });
            }
        });
    }

    private validateWithConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if(value && this.state.isDirty) {
            form.validateFields(['confirmPassword'], () => {})
        }
        callback();
    }

    private validateWithOriginal = (rule, value, callback) => {
        const form = this.props.form;
        if(value && value !== form.getFieldValue('password')) {
            callback("Two passwords that you entered are not the same.");
            return;
        }
        callback();
    }
    

    private validateUsername = (rule, value, callback) => {
        if(value && value.length < 6) {
            callback("Username is too short. (min length: 6)")
            return;
        }
        callback();
    }

    public render() {

        const { showPassword } = this.state;

        const lockIconString = showPassword ? "unlock" : "lock";
        const passwordType = showPassword ? "text" : "password";
        
        const lockClass = classNames({
            "lock-icon": true,
            "locked": !showPassword,
            "unlocked": showPassword
        });


        const { getFieldDecorator } = this.props.form;
        const iconStyle : React.CSSProperties = { color: "rgba(0,0,0,.25)" };

        return (
            <Form onSubmit={this.submitForm} className="register-form">
                <FormItem label="Username" hasFeedback>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: "Please input a username."}, { validator: this.validateUsername }]
                    })(
                        <Input prefix={<Icon type="user" style={iconStyle} />} placeholder="Username" />
                    )}
                </FormItem>
                <FormItem label="Email" hasFeedback>
                    {getFieldDecorator('email', {
                        rules: [
                            { type: 'email', message: "Plase input a valid email."},
                            { required: true, message: "Please input an email."}
                        ]
                    })(
                        <Input prefix={<Icon type="mail" style={iconStyle} />} placeholder="Email" />
                    )}
                </FormItem>
                <FormItem label="First Name" hasFeedback>
                    {getFieldDecorator('firstName')(
                        <Input placeholder="First Name" />
                    )}
                </FormItem>
                <FormItem label="Last Name" hasFeedback>
                    {getFieldDecorator('lastName')(
                        <Input placeholder="Last Name" />
                    )}
                </FormItem>
                <FormItem label="Password" hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: "Please input a password."}, { min: 8, validator: this.validateWithConfirm }]
                    })(
                        <Input prefix={<Icon type={lockIconString} className={lockClass} onClick={this.onLockClick} />} type={passwordType} placeholder="Password" />
                    )}
                </FormItem>
                <FormItem label="Confirm Password" hasFeedback>
                    {getFieldDecorator('confirmPassword', {
                        rules: [{ required: true, message: "Please input confirm password."}, { min: 8, validator: this.validateWithOriginal }]
                    })(
                        <Input prefix={<Icon type={lockIconString} className={lockClass} onClick={this.onLockClick} />} onBlur={this.handleBlur} type={passwordType} placeholder="Confirm Password" />
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