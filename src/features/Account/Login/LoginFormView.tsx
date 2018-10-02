import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { Form, Input, Icon, Button, Checkbox, Card } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { FormComponentProps } from "antd/lib/form/Form";

import './Login.scss';
import { loginService } from "./login-service";
import { userStore } from "../../../stores/user-store";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import ShowPasswordInput from "../../../components/ShowPasswordInput/ShowPasswordInput";

interface LoginFormData {
    username: string;
    password: string;
    remember: boolean;
}

@observer
class LoginForm extends React.Component<FormComponentProps & RouteComponentProps<any>> {

    private handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { form } = this.props;
        form.validateFields((err, values: LoginFormData) => {
            if(!err) {
                loginService.login(values)
                .then(data => {
                    userStore.setToken(data.token);
                    userStore.setUserData(data.user);

                    const { location } = this.props;
                    const newLocation = location.state && location.state.from ? location.state.from.pathname : "/";
                    this.props.history.push(newLocation)
                }).catch(reason => {
                    console.log(reason);
                });
                return;
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
                            <ShowPasswordInput />
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