import './Register.less';

import { Button, Card, Form, Icon, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import FormItem from 'antd/lib/form/FormItem';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import PasswordInput from 'src/components/PasswordInput/PasswordInput';
import { AuthStore } from 'src/stores/auth-store';

enum RegisterErrorCode {
    DuplicateUserName = 'DuplicateUserName',
    DuplicateEmail = 'DuplicateEmail',
}

interface IRegisterFormProps extends FormComponentProps {
    authStore?: AuthStore;
}

interface IRegisterFormState {
    isDirty: boolean;
}

@inject('authStore')
@observer
class RegisterForm extends React.Component<
    IRegisterFormProps,
    IRegisterFormState
> {
    public state = {
        isDirty: false,
    };

    private handleBlur = e => {
        const value = e.target.value;
        this.setState({ isDirty: this.state.isDirty || !!value });
    };

    private submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        const { form, authStore } = this.props;

        form.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            await authStore!.register(values);
        });
    };

    private validatePassword = (password: string): boolean => {
        const passwordRegex = new RegExp(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        );
        return passwordRegex.test(password);
    };

    private validateWithConfirm = (rule, value, callback) => {
        const form = this.props.form;

        if (!this.validatePassword(value)) {
            callback(
                'Password must contain at least one lowercase, uppercase, number and special character'
            );
            return;
        }

        if (value && this.state.isDirty) {
            form.validateFields(['confirmPassword'], { force: true });
        }
        callback();
    };

    private validateWithOriginal = (rule, value, callback) => {
        const form = this.props.form;

        if (!this.validatePassword(value)) {
            callback(
                'Password must contain at least one lowercase, uppercase, number and special character'
            );
            return;
        }

        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you entered are not the same.');
            return;
        }
        callback();
    };

    public render() {
        const { loading } = this.props.authStore!;
        const { getFieldDecorator } = this.props.form;
        const iconStyle: React.CSSProperties = { color: 'rgba(0,0,0,.25)' };

        const buttonText = loading ? 'Registering...' : 'Register';

        return (
            <Row>
                <Form onSubmit={this.submitForm} className="register-form">
                    <FormItem label="Username" hasFeedback>
                        {getFieldDecorator('username', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input a username.',
                                },
                                {
                                    min: 6,
                                    message:
                                        'Username must be at least 6 characters',
                                },
                            ],
                        })(
                            <Input
                                prefix={<Icon type="user" style={iconStyle} />}
                                placeholder="Username"
                            />
                        )}
                    </FormItem>
                    <FormItem label="Email" hasFeedback>
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    type: 'email',
                                    message: 'Plase input a valid email.',
                                },
                                {
                                    required: true,
                                    message: 'Please input an email.',
                                },
                            ],
                        })(
                            <Input
                                prefix={<Icon type="mail" style={iconStyle} />}
                                placeholder="Email"
                            />
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
                            rules: [
                                {
                                    min: 8,
                                    validator: this.validateWithConfirm,
                                },
                            ],
                        })(<PasswordInput />)}
                    </FormItem>
                    <FormItem label="Confirm Password" hasFeedback required>
                        {getFieldDecorator('confirmPassword', {
                            rules: [
                                {
                                    min: 8,
                                    validator: this.validateWithOriginal,
                                },
                            ],
                        })(
                            <PasswordInput
                                onBlur={this.handleBlur}
                                placeholder="Confirm Password"
                            />
                        )}
                    </FormItem>
                    <Button
                        loading={loading}
                        type="primary"
                        htmlType="submit"
                        className="register-form-button"
                    >
                        {buttonText}
                    </Button>
                    <br />
                    <br />
                    <span>
                        <Link to="/login">&#8592; Back to login</Link>
                    </span>
                </Form>
            </Row>
        );
    }
}

const RegisterFormView = Form.create()(RegisterForm);

const RegisterView = () => (
    <div className="register-form-container">
        <Card className="register-card-container" title="Register">
            <RegisterFormView />
        </Card>
    </div>
);

export default RegisterView;
