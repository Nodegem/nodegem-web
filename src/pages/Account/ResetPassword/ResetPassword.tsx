import React, { useEffect } from 'react';
import { Formik, FormikHelpers } from 'formik';
import { FlexColumn } from 'components';
import { FormItem, Input, Form, SubmitButton } from 'formik-antd';
import { Icon, Button } from 'antd';
import * as Yup from 'yup';
import { AuthService } from 'services';
import { appStore } from 'stores';

import './ResetPassword.less';
import routerHistory from 'utils/history';
import { useParams } from 'react-router';

interface IFormValues {
    password: string;
    confirmPassword: string;
}

const resetPasswordScheme = Yup.object().shape<IFormValues>({
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
});

export const ResetPassword: React.FC = () => {
    const { userId, resetToken } = useParams();

    const handleSubmit = async (
        values: IFormValues,
        actions: FormikHelpers<IFormValues>
    ) => {
        try {
            await AuthService.resetPasswordWithToken(
                userId!,
                resetToken!,
                values.password,
                values.confirmPassword
            );
            appStore.toast('Successfully reset password!', 'success');
            routerHistory.push('/login');
        } catch (e) {
            console.error(e);
            appStore.toast('Unable to reset password', 'error');
        }

        actions.setSubmitting(false);
    };

    return (
        <div className="reset-password-container">
            <div className="wrapper-container">
                <div className="form-content">
                    <h1>Forgot Password</h1>
                    <Formik
                        initialValues={{
                            password: '',
                            confirmPassword: '',
                        }}
                        validationSchema={resetPasswordScheme}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="forgot-password-form">
                                <FlexColumn>
                                    <FormItem
                                        name="password"
                                        label="Password"
                                        required
                                    >
                                        <Input.Password
                                            prefix={
                                                <Icon
                                                    type="lock"
                                                    style={{
                                                        color:
                                                            'rgba(0,0,0,.25)',
                                                    }}
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
                                                    style={{
                                                        color:
                                                            'rgba(0,0,0,.25)',
                                                    }}
                                                />
                                            }
                                            name="confirmPassword"
                                            placeholder="Confirm Password"
                                        />
                                    </FormItem>
                                    <SubmitButton
                                        type="primary"
                                        disabled={false}
                                    >
                                        {isSubmitting
                                            ? 'Resetting password...'
                                            : 'Reset Password'}
                                    </SubmitButton>
                                </FlexColumn>
                            </Form>
                        )}
                    </Formik>
                    <Button
                        style={{ marginTop: '10px', padding: '0' }}
                        type="link"
                        icon="arrow-left"
                        onClick={() => routerHistory.push('/login')}
                    >
                        Back to login
                    </Button>
                </div>
            </div>
        </div>
    );
};
