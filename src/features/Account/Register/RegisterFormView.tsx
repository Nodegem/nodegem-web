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
import { AxiosResponse } from 'axios';
import { displayErrorNotification } from 'src/utils/notification-helper';
import { Link } from 'react-router-dom';

enum RegisterErrorCode {
    DuplicateUserName = "DuplicateUserName",
    DuplicateEmail = "DuplicateEmail"
}

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
        this.props.form.validateFields(async (err, values) => {
            if(!err) {

                try {
                    const registerResult = await registerService.registerUser(values);
                    userStore.setUserData(registerResult);
                    history.push("/");
                } catch(err) {
                    const response = err.response as AxiosResponse;
                    if(response.status === 400) {
                        const data = response.data.reduce((prev, cur) => {
                            prev.push(cur.code);
                            return prev;
                        }, []);

                        if(data.includes(RegisterErrorCode.DuplicateUserName) || data.includes(RegisterErrorCode.DuplicateEmail)) {
                            this.showErrorNotification("Username and/or email already taken.");
                        } else {
                            this.showErrorNotification("Something went wrong during registration.");
                        }
                    } else {
                        this.showErrorNotification("Unable to register users at this time.")
                    }
                }
            }
        });
    }

    private showErrorNotification = (description: string) => {
        displayErrorNotification("Unable to register", description);
    }

    private validatePassword = (password: string) : boolean => {
        const passwordRegex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
        return passwordRegex.test(password);
    }

    private validateWithConfirm = (rule, value, callback) => {
        const form = this.props.form;

        if(!this.validatePassword(value)) {
            callback("Password must contain at least one lowercase, uppercase, number and special character")
            return;
        }

        if(value && this.state.isDirty) {
            form.validateFields(['confirmPassword'], { force: true })
        }
        callback();
    }

    private validateWithOriginal = (rule, value, callback) => {
        const form = this.props.form;

        if(!this.validatePassword(value)) {
            callback("Password must contain at least one lowercase, uppercase, number and special character")
            return;
        }

        if(value && value !== form.getFieldValue('password')) {
            callback("Two passwords that you entered are not the same.");
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
                        rules: [{ required: true, message: "Please input a username."}, { min: 6, message: "Username must be at least 6 characters" }]
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
                <FormItem label="Password" hasFeedback required>
                    {getFieldDecorator('password', {
                        rules: [{ min: 8, validator: this.validateWithConfirm }]
                    })(
                        <Input prefix={<Icon type={lockIconString} className={lockClass} onClick={this.onLockClick} />} type={passwordType} placeholder="Password" />
                    )}
                </FormItem>
                <FormItem label="Confirm Password" hasFeedback required>
                    {getFieldDecorator('confirmPassword', {
                        rules: [{ min: 8, validator: this.validateWithOriginal }]
                    })(
                        <Input prefix={<Icon type={lockIconString} className={lockClass} onClick={this.onLockClick} />} onBlur={this.handleBlur} type={passwordType} placeholder="Confirm Password" />
                    )}
                </FormItem>
                <Button type="primary" htmlType="submit" className="register-form-button">Register</Button>
                <br />
                <br />
                <span>
                    <Link to="/login">&#8592; Back to login</Link>
                </span>
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