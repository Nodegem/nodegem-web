import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { Form, Input, Icon, Button, Checkbox, Card, notification, message } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { FormComponentProps } from "antd/lib/form/Form";

import './Login.scss';
import { loginService } from "./login-service";
import { userStore } from "../../../stores/user-store";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { AxiosResponse } from "axios";
import { displayErrorNotification } from "src/utils/notification-helper";

interface LoginFormData {
    username: string;
    password: string;
    remember: boolean;
}

@observer
class LoginForm extends React.Component<FormComponentProps & RouteComponentProps<any>, { showPassword: boolean }> {

    state = {
        showPassword: false
    }

    private onLockClick = () => {
        this.setState({ showPassword: !this.state.showPassword });
    }

    private showErrorNotification = (description: string) => {
        displayErrorNotification("Unable to login", description);
    }

    private handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { form } = this.props;
        form.validateFields(async (err, values: LoginFormData) => {
            if(!err) {
                try {
                    const loginData = await loginService.login(values);
                    userStore.setUserData(loginData);
                    userStore.setRefreshTokenInterval();
    
                    const { location } = this.props;
                    const newLocation = location.state && location.state.from ? location.state.from.pathname : "/";
                    this.props.history.push(newLocation)
                } catch(err) {
                    if(err && err.response as AxiosResponse) {
                        const response = err.response as AxiosResponse;
                        if(response.status === 400 || response.status === 401) {
                            this.showErrorNotification("Invalid username or password.")
                        } else {
                            this.showErrorNotification("An unknown error has occurred.")
                        }
                    } else {
                        this.showErrorNotification("Unable to connect to service.")
                    }
                }
            }

            userStore.setRememberMe(values.remember);
            userStore.setRememberedUserData({ username: values.username });
        });
    }

    private onUsernameChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        userStore.setRememberedUserData({ username: target.value });
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

        return (
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: "Please input your username."}],
                            initialValue: userStore.rememberMe && userStore.rememberedData
                                ? userStore.rememberedData.username
                                : ""
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} onChange={this.onUsernameChange} placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: "Please input your password."}],
                        })(
                            <Input prefix={<Icon type={lockIconString} className={lockClass} onClick={this.onLockClick} />} type={passwordType} placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: userStore.rememberMe
                        })(
                            <Checkbox>Remember me</Checkbox>
                        )}
                        <Link to="forgot-password" className="login-form-forgot">Forgot Password?</Link>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        <span className="login-register-now">
                            Or <Link to="/register">Register now!</Link>
                        </span>
                    </FormItem>
                </Form>
            );
    }

}

const LoginFormView = withRouter(Form.create()(LoginForm));

const LoginView = () => 
        <div className="login-form-container">
            <Card 
                className="login-card-container"
                title="Login">
                <LoginFormView />
            </Card>
        </div>

export default LoginView;