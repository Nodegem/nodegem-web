import './Login.less';

import { Card, Icon } from 'antd';
import { FlexColumn, FlexRow } from 'components';
import { Formik, FormikActions } from 'formik';
import { Checkbox, Form, FormItem, Input, SubmitButton } from 'formik-antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
    GithubLoginButton,
    GoogleLoginButton,
} from 'react-social-login-buttons';
import { AuthService } from 'services';
import { appStore } from 'stores/app-store';
import routerHistory from 'utils/history';
import * as Yup from 'yup';

// interface ILoginFormProps extends FormComponentProps {
//     authStore?: AuthStore;
// }

// @inject('authStore')
// @observer
// class LoginForm extends React.Component<ILoginFormProps> {
//     private handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         const { form, authStore } = this.props;
//         form.validateFields(async (err, values) => {
//             if (err) {
//                 return;
//             }

//             try {
//                 const { rememberMe, userName } = values;
//                 authStore!.setRememberMe(rememberMe, userName);
//                 await authStore!.login(values);
//             } catch (e) {
//                 console.log(e);
//                 console.log(e.response);
//             }
//         });
//     };

//     public render() {
//         const { authStore } = this.props;
//         const { getFieldDecorator } = this.props.form;
//         const { loading } = this.props.authStore!;

//         const { rememberMe, savedUsername } = authStore!;

//         const buttonText = loading ? 'Logging in' : 'Log in';

//         return (
//             <Row>
//                 <Form onSubmit={this.handleSubmit} className="login-form">
//                     <FormItem>
//                         {getFieldDecorator('userName', {
//                             initialValue: savedUsername,
//                             rules: [
//                                 {
//                                     required: true,
//                                     message: 'Please input your username.',
//                                 },
//                             ],
//                         })(
//                             <Input
//                                 prefix={
//                                     <Icon
//                                         type="user"
//                                         style={{ color: 'rgba(0,0,0,.25)' }}
//                                     />
//                                 }
//                                 placeholder="Username"
//                             />
//                         )}
//                     </FormItem>
//                     <FormItem>
//                         {getFieldDecorator('password', {
//                             rules: [
//                                 {
//                                     required: true,
//                                     message: 'Please input your password.',
//                                 },
//                             ],
//                         })(<PasswordInput />)}
//                     </FormItem>
//                     <FormItem>
//                         {getFieldDecorator('rememberMe', {
//                             valuePropName: 'checked',
//                             initialValue: rememberMe,
//                         })(<Checkbox>Remember me</Checkbox>)}
//                         <Link
//                             to="forgot-password"
//                             className="login-form-forgot"
//                         >
//                             Forgot Password?
//                         </Link>
//                         <Button
//                             type="primary"
//                             htmlType="submit"
//                             className="login-form-button"
//                             loading={loading}
//                         >
//                             {buttonText}
//                         </Button>
//                         <span className="login-register-now">
//                             Or <Link to="/register">Register now!</Link>
//                         </span>
//                     </FormItem>
//                 </Form>
//             </Row>
//         );
//     }
// }

// const LoginFormView = Form.create()(LoginForm);

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
        actions: FormikActions<IFormValues>
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
                            <Link to="/register">Or Signup</Link>
                        </FlexRow>
                        <SubmitButton type="primary" disabled={false}>
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </SubmitButton>
                    </FlexColumn>
                </Form>
            )}
        />
    );
};

const LoginView = () => {
    const handleSubmit = async (
        values: IFormValues,
        actions: FormikActions<IFormValues>
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
