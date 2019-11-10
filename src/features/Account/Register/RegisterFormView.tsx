import './Register.less';

import { Button, Card, Icon } from 'antd';
import { FlexColumn } from 'components';
import { Formik, FormikHelpers } from 'formik';
import { Form, FormItem, Input, SubmitButton } from 'formik-antd';
import * as React from 'react';
import { AuthService } from 'services';
import { appStore } from 'stores';
import routerHistory from 'utils/history';
import * as Yup from 'yup';

const validation = Yup.object().shape<IFormValues>({
    userName: Yup.string()
        .min(4, value => `Username must be at least ${value.min} characters`)
        .matches(
            /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
            'Invalid username'
        )
        .required('Username is required'),
    email: Yup.string()
        .email('Must be a valid email')
        .required('Email is required'),
    password: Yup.string()
        .matches(
            new RegExp(
                '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
            ),
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
                            {isSubmitting ? ' Signing up...' : 'Register'}
                        </SubmitButton>
                    </FlexColumn>
                    <br />
                    <Button
                        type="link"
                        icon="arrow-left"
                        onClick={() => routerHistory.goBack()}
                    >
                        Go Back
                    </Button>
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

    return (
        <div className="register-form-container">
            <Card className="register-card-container" title="Register">
                <RegisterForm handleSubmit={handleSubmit} />
            </Card>
        </div>
    );
};

export default RegisterView;
