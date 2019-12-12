import React from 'react';

import './ForgotPassword.less';
import { SubmitButton, FormItem, Form, Input } from 'formik-antd';
import { FlexColumn } from 'components';
import { Formik, FormikHelpers } from 'formik';
import { Icon, Button } from 'antd';
import * as Yup from 'yup';
import { appStore } from 'stores';
import { AuthService } from 'services';
import routerHistory from 'utils/history';

interface IFormValues {
    email: string;
}

const emailValidationSchema = Yup.object().shape<IFormValues>({
    email: Yup.string()
        .email('Must be a valid email')
        .required('Email is required'),
});

export const ForgotPassword: React.FC = () => {
    const handleSubmit = async (
        values: IFormValues,
        actions: FormikHelpers<IFormValues>
    ) => {
        try {
            await AuthService.forgotPassword(values.email);
        } catch (e) {
            console.error(e);
        }

        appStore.toast('Sending email...', 'info');
        actions.resetForm();
        actions.setSubmitting(false);
    };

    return (
        <div className="forgot-password-container">
            <div className="wrapper-container">
                <div className="form-content">
                    <h1>Forgot Password</h1>
                    <Formik
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={emailValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="forgot-password-form">
                                <FlexColumn>
                                    <FormItem name="email">
                                        <Input
                                            name="email"
                                            prefix={
                                                <Icon
                                                    type="mail"
                                                    style={{
                                                        color:
                                                            'rgba(0,0,0,.25)',
                                                    }}
                                                />
                                            }
                                            placeholder="Email"
                                        />
                                    </FormItem>
                                    <SubmitButton
                                        type="primary"
                                        disabled={false}
                                    >
                                        {isSubmitting
                                            ? 'Sending email...'
                                            : 'Send Email'}
                                    </SubmitButton>
                                </FlexColumn>
                            </Form>
                        )}
                    </Formik>
                    <Button
                        style={{ marginTop: '5px', padding: '0' }}
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
