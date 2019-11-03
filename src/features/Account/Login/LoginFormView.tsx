import './Login.less';

import { Button, Card, Icon } from 'antd';
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
import routerHistory from 'utils/history';
import * as Yup from 'yup';

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
            render={({ isSubmitting }) => (
                <Form className="login-form">
                    <FlexColumn gap={15}>
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
                        <FlexRow className="other">
                            <Checkbox name="rememberMe">Remember Me?</Checkbox>
                        </FlexRow>
                        <SubmitButton
                            type="primary"
                            icon="login"
                            disabled={false}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </SubmitButton>
                        <Button
                            type="default"
                            icon="solution"
                            onClick={() => routerHistory.push('/register')}
                        >
                            Sign Up
                        </Button>
                    </FlexColumn>
                </Form>
            )}
        />
    );
};

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

    return (
        <div className="login-form-container">
            <Card className="login-card-container" title="Login">
                <FlexRow gap={10}>
                    <FlexColumn>
                        <LoginForm handleSubmit={handleSubmit} />
                    </FlexColumn>
                    <FlexColumn className="social-logins">
                        <a href={AuthService.loginGoogle()}>
                            <GoogleLoginButton />
                        </a>
                        <a href={AuthService.loginGitHub()}>
                            <GithubLoginButton />
                        </a>
                    </FlexColumn>
                </FlexRow>
            </Card>
        </div>
    );
};

export default LoginView;
