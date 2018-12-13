import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import {
    Form,
    Input,
    Icon,
    Button,
    Checkbox,
    Card,
    Row
} from "antd";
import FormItem from "antd/lib/form/FormItem";
import { FormComponentProps } from "antd/lib/form/Form";

import "./Login.less";
import { observer, inject } from "mobx-react";
import { Link } from "react-router-dom";
import PasswordInput from "src/components/PasswordInput/PasswordInput";
import { AuthStore } from "src/stores/auth-store";

interface LoginFormProps extends FormComponentProps {
    authStore?: AuthStore;
}

@inject('authStore')
@observer
class LoginForm extends React.Component<LoginFormProps & RouteComponentProps<any>> {

    private handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { form, authStore } = this.props;
        form.validateFields(async (err, values) => {

            authStore!.setRememberMe(values.rememberMe, { username: values.userName });

            if(err) return;

            try {
                await authStore!.login(values);


            } catch(e) {
                console.log(e.response);
            }
        })
    };

    public render() {
        const { authStore } = this.props;
        const { getFieldDecorator } = this.props.form;

        const { rememberMe, savedCredentials } = authStore!;

        return (
            <Row>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator("userName", {
                            initialValue: savedCredentials['username'],
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your username."
                                }
                            ]
                        })(
                            <Input
                                prefix={
                                    <Icon
                                        type="user"
                                        style={{ color: "rgba(0,0,0,.25)" }}
                                    />
                                }
                                placeholder="Username"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("password", {
                            rules: [
                                {
                                    required: true,
                                    message: "Please input your password."
                                }
                            ]
                        })(<PasswordInput />)}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("rememberMe", {
                            valuePropName: "checked",
                            initialValue: rememberMe
                        })(<Checkbox >Remember me</Checkbox>)}
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
                        >
                            Log in
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

const LoginFormView = withRouter(Form.create()(LoginForm));

const LoginView = () => (
    <div className="login-form-container">
        <Card className="login-card-container" title="Login">
            <LoginFormView />
        </Card>
    </div>
);

export default LoginView;
