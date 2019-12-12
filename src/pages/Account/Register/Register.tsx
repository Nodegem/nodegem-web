import './Register.less';

import { Button, Icon, Divider, List } from 'antd';
import { FlexColumn } from 'components';
import { Formik, FormikHelpers } from 'formik';
import { Form, FormItem, Input, SubmitButton } from 'formik-antd';
import * as React from 'react';
import { AuthService } from 'services';
import { appStore } from 'stores';
import routerHistory from 'utils/history';
import * as Yup from 'yup';
import { popup } from 'utils';
import {
    GoogleLoginButton,
    GithubLoginButton,
} from 'react-social-login-buttons';

import space from 'assets/login/space.svg';
import rocket from 'assets/login/rocket.svg';
import planet from 'assets/login/saturn.svg';

const validation = Yup.object().shape<IFormValues>({
    userName: Yup.string()
        .min(4, value => `Username must be at least ${value.min} characters`)
        .matches(
            /^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){4,20}[a-zA-Z0-9]$/,
            'Invalid username'
        )
        .required('Username is required'),
    email: Yup.string()
        .email('Must be a valid email')
        .required('Email is required'),
    password: Yup.string()
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            'Password must contain at least one lowercase, uppercase, number and special character'
        )
        .min(8, value => `Password must be at least ${value.min} characters`)
        .required('Password is required'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        'Passwords must match'
    ),
    firstName: Yup.string().notRequired(),
    lastName: Yup.string().notRequired(),
});

interface IFormValues {
    userName: string;
    email: string;
    firstName?: string;
    lastName?: string;
    password: string;
    confirmPassword: string;
}

interface IRegisterFormProps {
    handleSubmit: (
        values: IFormValues,
        actions: FormikHelpers<IFormValues>
    ) => void;
}

const RegisterForm: React.FC<IRegisterFormProps> = ({ handleSubmit }) => {
    return (
        <Formik
            initialValues={{
                userName: '',
                email: '',
                password: '',
                confirmPassword: '',
                firstName: '',
                lastName: '',
            }}
            validationSchema={validation}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <Form className="registration-form">
                    <FlexColumn>
                        <FormItem name="userName" label="Username" required>
                            <Input
                                name="userName"
                                prefix={
                                    <Icon
                                        type="user"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                placeholder="Username"
                            />
                        </FormItem>
                        <FormItem name="email" label="Email" required>
                            <Input
                                name="email"
                                prefix={
                                    <Icon
                                        type="mail"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                placeholder="Email"
                            />
                        </FormItem>
                        <FormItem name="firstName" label="First Name">
                            <Input name="firstName" placeholder="First Name" />
                        </FormItem>
                        <FormItem name="lastName" label="Last Name">
                            <Input name="lastName" placeholder="Last Name" />
                        </FormItem>
                        <FormItem name="password" label="Password" required>
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
                        <FormItem
                            name="confirmPassword"
                            label="Confirm Password"
                            required
                        >
                            <Input.Password
                                prefix={
                                    <Icon
                                        type="lock"
                                        style={{ color: 'rgba(0,0,0,.25)' }}
                                    />
                                }
                                name="confirmPassword"
                                placeholder="Confirm Password"
                            />
                        </FormItem>
                        <br />
                        <SubmitButton type="primary" disabled={false}>
                            {isSubmitting ? 'Signing up...' : 'Register'}
                        </SubmitButton>
                    </FlexColumn>
                </Form>
            )}
        </Formik>
    );
};

const RegisterView = () => {
    const handleSubmit = async (
        values: IFormValues,
        actions: FormikHelpers<IFormValues>
    ) => {
        try {
            const result = await AuthService.register(values);

            appStore.userStore.setToken(result);
            routerHistory.push('/');
        } catch (e) {
            const commonParams = {
                title: 'Unable to complete registration',
                type: 'error' as any,
                closeBtn: true,
                duration: 2.5,
            };

            if (!e) {
                appStore.openNotification({
                    ...commonParams,
                    description: 'Oops, something went wrong',
                });
            } else {
                if (e.status === 400 && e.body) {
                    appStore.openNotification({
                        ...commonParams,
                        description: e.body.map(x => x.description).join(', '),
                    });
                } else {
                    appStore.openNotification({
                        ...commonParams,
                        description: 'An unexpected error occurred',
                    });
                }
            }
        } finally {
            actions.setSubmitting(false);
        }
    };

    const onGoogleLogin = () => {
        popup(AuthService.loginGoogle(), 'Google Signup');
    };

    const onGithubLogin = () => {
        popup(AuthService.loginGitHub(), 'Github Signup');
    };

    const components = [
        <RegisterForm handleSubmit={handleSubmit} />,
        <Divider>Or</Divider>,
        <a onClick={onGoogleLogin}>
            <GoogleLoginButton className="social" text="Register with Google" />
        </a>,
        <a onClick={onGithubLogin}>
            <GithubLoginButton className="social" text="Register with GitHub" />
        </a>,
        <Button
            type="link"
            icon="arrow-left"
            onClick={() => routerHistory.goBack()}
        >
            Go Back
        </Button>,
    ];

    return (
        <div className="register-container">
            <div className="wrapper-container">
                <div className="form-content">
                    <h1>Register</h1>
                    <List
                        grid={{ gutter: 10, sm: 1 }}
                        dataSource={components}
                        renderItem={item => <List.Item>{item}</List.Item>}
                    />
                </div>
                <div className="picture-content">
                    <div className="space-background">
                        <img src={space} />
                    </div>
                    <div className="spaceship">
                        <img src={rocket} />
                    </div>
                    <div className="planet">
                        <img src={planet} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;
