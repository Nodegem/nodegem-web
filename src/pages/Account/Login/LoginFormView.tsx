import './Login.less';

import { Button, Icon, Divider, List } from 'antd';
import { FlexColumn, FlexRow } from 'components';
import { Formik, FormikHelpers } from 'formik';
import { Checkbox, Form, FormItem, Input, SubmitButton } from 'formik-antd';
import * as React from 'react';
import {
    GithubLoginButton,
    GoogleLoginButton,
} from 'react-social-login-buttons';
import { AuthService } from 'services';
import { appStore } from 'stores/app-store';
import { popup } from 'utils';
import routerHistory from 'utils/history';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

import rocket from 'assets/login/rocket.svg';
import planet from 'assets/login/saturn.svg';

const formValidation = Yup.object().shape({
    username: Yup.string().required('Username required'),
    password: Yup.string().required('Password required'),
});

interface IFormValues {
    username: string;
    password: string;
    rememberMe: boolean;
}

interface ILoginFormProps {
    handleSubmit: (
        values: IFormValues,
        actions: FormikHelpers<IFormValues>
    ) => void;
}
const LoginForm: React.FC<ILoginFormProps> = ({ handleSubmit }) => {
    return (
        <Formik
            initialValues={{
                username: '',
                password: '',
                rememberMe: false,
            }}
            validationSchema={formValidation}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="login-form">
                    <FlexColumn gap={10}>
                        <FormItem name="username">
                            <Input
                                name="username"
                                prefix={
                                    <Icon
                                        type="user"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                placeholder="Username"
                            />
                        </FormItem>
                        <FormItem name="password">
                            <Input.Password
                                prefix={
                                    <Icon
                                        type="lock"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                name="password"
                                placeholder="Password"
                            />
                        </FormItem>
                        <FlexRow
                            className="other"
                            style={{ display: 'inline-flex' }}
                        >
                            <Checkbox name="rememberMe">Remember Me?</Checkbox>
                            <Link to="forgot-password">Forgot password?</Link>
                        </FlexRow>
                        <SubmitButton
                            type="primary"
                            icon="login"
                            disabled={false}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </SubmitButton>
                    </FlexColumn>
                </Form>
            )}
        </Formik>
    );
};

window.addEventListener('message', event => {
    const { result } = event.data;
    if (result && result.socialLogin) {
        if (!!result.token && result.success) {
            // Make a login request
            appStore.userStore.loginWithToken(result.token as string);
        } else {
            appStore.openNotification({
                title: 'Unable to sign-in',
                description: result.message as string,
                type: 'error',
            });
            routerHistory.push('/login');
        }
    }
});

const LoginView = () => {
    const handleSubmit = async (
        values: IFormValues,
        actions: FormikHelpers<IFormValues>
    ) => {
        try {
            const result = await AuthService.login(
                values.username,
                values.password
            );

            appStore.userStore.setToken(result);
            routerHistory.push('/');
        } catch (e) {
            const commonParams = {
                title: 'Unable to login',
                type: 'error' as any,
                closeBtn: true,
                duration: 1.5,
            };

            if (!e) {
                appStore.openNotification({
                    ...commonParams,
                    description: 'Oops, something went wrong',
                });
            } else {
                if (e.status === 400) {
                    appStore.openNotification({
                        ...commonParams,
                        description: e.text,
                    });
                } else if (e.status === 401) {
                    appStore.openNotification({
                        ...commonParams,
                        description: 'Invalid username or password',
                    });
                }
            }
        } finally {
            actions.setSubmitting(false);
        }
    };

    const onGoogleLogin = () => {
        popup(AuthService.loginGoogle(), 'Google Login');
    };

    const onGithubLogin = () => {
        popup(AuthService.loginGitHub(), 'Github Login');
    };

    const components = [
        <LoginForm handleSubmit={handleSubmit} />,
        <Divider>Or</Divider>,
        <a onClick={onGoogleLogin}>
            <GoogleLoginButton className="social" />
        </a>,
        <a onClick={onGithubLogin}>
            <GithubLoginButton className="social" />
        </a>,
        <div className="register-button">
            Don't have an account?
            <Link to="/register">Click here</Link>
        </div>,
    ];

    return (
        <div className="login-container">
            <div className="wrapper-container">
                <div className="picture-content">
                    <div className="space-background" />
                    <div className="spaceship">
                        <img src={rocket} />
                    </div>
                    <div className="planet">
                        <img src={planet} />
                    </div>
                </div>
                <div className="form-content">
                    <h1>Login</h1>
                    <List
                        grid={{ gutter: 10, sm: 1 }}
                        dataSource={components}
                        renderItem={item => <List.Item>{item}</List.Item>}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoginView;
