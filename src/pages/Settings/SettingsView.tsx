import './Settings.less';

import {
    Avatar,
    Button,
    Card,
    Divider,
    List,
    Descriptions,
    Typography,
    Icon,
} from 'antd';
import { FlexColumn, FlexRow, ConstantsForm } from 'components';
import { useStore } from 'overstated';
import React, { useEffect } from 'react';
import { appStore } from 'stores';
import { Formik, FormikHelpers } from 'formik';
import { Input, SubmitButton, FormItem, ResetButton, Form } from 'formik-antd';
import * as Yup from 'yup';
import {
    GoogleLoginButton,
    GithubLoginButton,
} from 'react-social-login-buttons';
import { popup } from 'utils';
import { UserService } from 'services/user/user-service';
import qs from 'qs';
import classNames from 'classnames';
import { AuthService } from 'services';

const { Paragraph } = Typography;

window.addEventListener('message', event => {
    const { result } = event.data;
    if (result && result.linkAccount) {
        if (result.success) {
            appStore.openNotification({
                title: 'Successfully linked account!',
                description: `Account is now linked to ${result.provider}`,
                type: 'success',
            });
        } else {
            appStore.openNotification({
                title: 'Unable to link account',
                description: result.message as string,
                type: 'error',
            });
        }
    }
});

const SettingsSection = () => {
    const { user, patchUser } = useStore(appStore.userStore, store => ({
        user: store.user,
        patchUser: store.patchUser,
    }));

    return (
        <Card className="profile-section" title="Profile" bordered={false}>
            <FlexColumn gap={35}>
                <FlexColumn className="account-avatar">
                    <Avatar
                        size={128}
                        icon="user"
                        src={user.avatarUrl}
                        shape="square"
                    />
                    <span className="username">{user.userName}</span>
                </FlexColumn>
                <FlexColumn className="account-info">
                    <Divider orientation="left">Account Info</Divider>
                    <br />
                    <Descriptions column={1} bordered size="middle">
                        <Descriptions.Item label="First Name:">
                            <Paragraph
                                editable={{
                                    onChange: value => {
                                        if (value === user.firstName) return;
                                        patchUser({ firstName: value });
                                    },
                                }}
                            >
                                {user.firstName}
                            </Paragraph>
                        </Descriptions.Item>
                        <Descriptions.Item label="Last Name:">
                            <Paragraph
                                editable={{
                                    onChange: value => {
                                        if (value === user.lastName) return;
                                        patchUser({ lastName: value });
                                    },
                                }}
                            >
                                {user.lastName}
                            </Paragraph>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email:">
                            {user.email}
                        </Descriptions.Item>
                    </Descriptions>
                </FlexColumn>
            </FlexColumn>
        </Card>
    );
};

interface IResetPasswordForm {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const resetPasswordSchema = Yup.object().shape<IResetPasswordForm>({
    currentPassword: Yup.string().required('Password is required'),
    newPassword: Yup.string()
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            'Password must contain at least one lowercase, uppercase, number and special character'
        )
        .min(8, value => `Password must be at least ${value.min} characters`)
        .notOneOf(
            [Yup.ref('currentPassword')],
            'New password cannot be the same as old'
        )
        .required('Password is required'),
    confirmNewPassword: Yup.string().oneOf(
        [Yup.ref('newPassword')],
        'Passwords must match'
    ),
});

const PersonalSettings = () => {
    const { user, isLinked, patchUser } = useStore(
        appStore.userStore,
        store => ({
            user: store.user,
            patchUser: store.patchUser,
            isLinked: store.alreadyLinkedToProvider,
        })
    );

    const onGoogleLink = () => {
        if (isLinked('Google')) return;
        popup(UserService.linkGoogle(user.id), 'Google Link');
    };

    const onGitHubLink = () => {
        if (isLinked('GitHub')) return;
        popup(UserService.linkGithub(user.id), 'Github Link');
    };

    const socialLogins = [
        <a onClick={onGoogleLink}>
            <GoogleLoginButton
                className={classNames({
                    social: true,
                    disabled: isLinked('Google'),
                })}
                text={
                    isLinked('Google')
                        ? 'Already linked'
                        : 'Link Google Account'
                }
            />
        </a>,
        <a onClick={onGitHubLink}>
            <GithubLoginButton
                className={classNames({
                    social: true,
                    disabled: isLinked('GitHub'),
                })}
                text={
                    isLinked('GitHub')
                        ? 'Already linked'
                        : 'Link GitHub Account'
                }
            />
        </a>,
    ];

    const formItems = [
        <FormItem name="newPassword" label="New Password">
            <Input.Password
                name="newPassword"
                prefix={
                    <Icon
                        type="lock"
                        style={{
                            color: 'rgba(0,0,0,.25)',
                        }}
                    />
                }
                placeholder="New Password"
            />
        </FormItem>,
        <FormItem name="confirmNewPassword" label="Confirm New Password">
            <Input.Password
                name="confirmNewPassword"
                prefix={
                    <Icon
                        type="lock"
                        style={{
                            color: 'rgba(0,0,0,.25)',
                        }}
                    />
                }
                placeholder="Confirm New Password"
            />
        </FormItem>,
    ];

    const handleConstantSubmit = async (
        values: { constants: IFormConstantData[] },
        formikHelpers: FormikHelpers<{ constants: IFormConstantData[] }>
    ) => {
        try {
            await patchUser({ constants: values.constants });
            appStore.toast('Successfully saved!', 'success');
        } catch (e) {
            console.error(e);
            appStore.toast('Unable to save', 'error');
        }

        formikHelpers.setSubmitting(false);
    };

    const handleResetPasswordSubmit = async (
        values: IResetPasswordForm,
        formikHelpers: FormikHelpers<IResetPasswordForm>
    ) => {
        try {
            await AuthService.resetPassword(
                values.currentPassword,
                values.newPassword,
                values.confirmNewPassword
            );
            appStore.toast('Successfully reset password!', 'success');
            formikHelpers.resetForm();
        } catch (e) {
            console.error(e);
            appStore.toast('Unable to update password.', 'error');
        }

        formikHelpers.setSubmitting(false);
    };

    return (
        <Card
            className="personal-settings-section"
            title="Edit Personal Settings"
            bordered={false}
        >
            <Divider orientation="left">Global Constants</Divider>
            <ConstantsForm
                constants={user.constants}
                onSubmit={handleConstantSubmit}
            />
            <Divider orientation="left">Reset Password</Divider>
            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                }}
                validationSchema={resetPasswordSchema}
                onSubmit={handleResetPasswordSubmit}
            >
                {({ isSubmitting, isValid, dirty }) => (
                    <Form>
                        <FlexColumn gap={15}>
                            <FormItem
                                name="currentPassword"
                                label="Current Password"
                            >
                                <Input.Password
                                    name="currentPassword"
                                    prefix={
                                        <Icon
                                            type="lock"
                                            style={{
                                                color: 'rgba(0,0,0,.25)',
                                            }}
                                        />
                                    }
                                    placeholder="Current Password"
                                />
                            </FormItem>
                            <List
                                grid={{ gutter: 16, md: 1, lg: 2 }}
                                dataSource={formItems}
                                renderItem={formItem => (
                                    <List.Item>{formItem}</List.Item>
                                )}
                            />
                            <Button.Group>
                                <ResetButton
                                    type="danger"
                                    className="reset-button"
                                    style={{ width: '50%' }}
                                >
                                    Reset
                                </ResetButton>
                                <SubmitButton
                                    disabled={!dirty || !isValid}
                                    loading={isSubmitting}
                                    style={{ width: '50%' }}
                                >
                                    Update Password
                                </SubmitButton>
                            </Button.Group>
                        </FlexColumn>
                    </Form>
                )}
            </Formik>
            <Divider orientation="left">Link Social Logins</Divider>
            <List
                grid={{ gutter: 16, md: 1, lg: 2 }}
                dataSource={socialLogins}
                renderItem={loginButton => <List.Item>{loginButton}</List.Item>}
            />
            <Divider orientation="left">Danger Zone</Divider>
            <FlexRow gap={15} className="danger-zone" justifyContent="center">
                <label>Delete account permanently?</label>
                <Button type="danger" icon="delete">
                    Delete
                </Button>
            </FlexRow>
        </Card>
    );
};

export const SettingsView = () => {
    const views = [SettingsSection, PersonalSettings];

    useEffect(() => {
        const queryValues = qs.parse(location.search.replace('?', ''));

        if (window.opener) {
            const data = {
                result: {
                    linkAccount: true,
                    success: queryValues.success === 'true',
                    message: queryValues.message,
                    provider: queryValues.provider,
                },
            };
            window.opener.postMessage(data, '*');
            window.close();
        }
    }, []);

    return (
        <FlexRow className="profile" gap={30}>
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 2,
                }}
                dataSource={views}
                renderItem={View => (
                    <List.Item className="profile-view-item">
                        <View />
                    </List.Item>
                )}
            />
        </FlexRow>
    );
};
