import './Login.less';

import { Button, Card, Checkbox, Form, Icon, Input, Row } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import PasswordInput from 'src/components/PasswordInput/PasswordInput';
import { AuthStore } from 'src/stores/auth-store';

interface ILoginFormProps extends FormComponentProps {
    authStore?: AuthStore;
}

@inject('authStore')
@observer
class LoginForm extends React.Component<ILoginFormProps> {
    private handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { form, authStore } = this.props;
        form.validateFields(async (err, values) => {
            authStore!.setRememberMe(values.rememberMe, {
                username: values.userName,
            });

            if (err) {
                return;
            }

            try {
                await authStore!.login(values);
            } catch (e) {
                console.log(e.response);
            }
        });
    };

    public render() {
        const { authStore } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { loading } = this.props.authStore!;

        const { rememberMe, savedCredentials } = authStore!;

        const buttonText = loading ? 'Logging in' : 'Log in';

        return (
            <Row>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('userName', {
                            initialValue: savedCredentials.username,
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your username.',
                                },
                            ],
                        })(
                            <Input
                                prefix={
                                    <Icon
                                        type="user"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                placeholder="Username"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your password.',
                                },
                            ],
                        })(<PasswordInput />)}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('rememberMe', {
                            valuePropName: 'checked',
                            initialValue: rememberMe,
                        })(<Checkbox>Remember me</Checkbox>)}
                        <Link
                            to="forgot-password"
                            className="login-form-forgot"
                        >
                            Forgot Password?
                        </Link>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            loading={loading}
                        >
                            {buttonText}
                        </Button>
                        <span className="login-register-now">
                            Or <Link to="/register">Register now!</Link>
                        </span>
                    </FormItem>
                </Form>
            </Row>
        );
    }
}

const LoginFormView = Form.create()(LoginForm);

const LoginView = () => (
    <div className="login-form-container">
        <Card className="login-card-container" title="Login">
            <LoginFormView />
        </Card>
    </div>
);

export default LoginView;
