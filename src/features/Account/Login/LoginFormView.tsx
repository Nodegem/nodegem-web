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
import classNames from "classnames";
import { displayErrorNotification } from "src/utils/notification-helper";

@inject('authStore')
@observer
class LoginForm extends React.Component<
    FormComponentProps & RouteComponentProps<any>,
    { showPassword: boolean }
> {
    state = {
        showPassword: false
    };

    private onLockClick = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    private showErrorNotification = (description: string) => {
        displayErrorNotification("Unable to login", description);
    };

    private handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    private onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
    };

    public render() {
        const { showPassword } = this.state;

        const lockIconString = showPassword ? "unlock" : "lock";
        const passwordType = showPassword ? "text" : "password";

        const lockClass = classNames({
            "lock-icon": true,
            locked: !showPassword,
            unlocked: showPassword
        });

        const { getFieldDecorator } = this.props.form;

        return (
            <Row>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator("username", {
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
                                onChange={this.onUsernameChange}
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
                        })(
                            <Input
                                prefix={
                                    <Icon
                                        type={lockIconString}
                                        className={lockClass}
                                        onClick={this.onLockClick}
                                    />
                                }
                                type={passwordType}
                                placeholder="Password"
                            />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("remember", {
                            valuePropName: "checked",
                            initialValue: false
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
