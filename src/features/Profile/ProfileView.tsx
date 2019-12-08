import './Profile.less';

import {
    Avatar,
    Button,
    Card,
    Divider,
    List,
    Descriptions,
    Typography,
    Form,
    Icon,
} from 'antd';
import { FlexColumn, FlexRow } from 'components';
import { useStore } from 'overstated';
import * as React from 'react';
import { appStore } from 'stores';
import { Formik } from 'formik';
import { Input, SubmitButton, FormItem } from 'formik-antd';
import * as Yup from 'yup';

const { Paragraph } = Typography;

const ProfileSection = () => {
    const { user } = useStore(appStore.userStore, store => ({
        user: store.user,
    }));

    return (
        <Card className="profile-section" title="Your Profile" bordered={false}>
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
                            <Paragraph editable>
                                {user.firstName || 'N/A'}
                            </Paragraph>
                        </Descriptions.Item>
                        <Descriptions.Item label="Last Name:">
                            <Paragraph editable>
                                {user.lastName || 'N/A'}
                            </Paragraph>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email:">
                            {user.email}
                        </Descriptions.Item>
                    </Descriptions>
                </FlexColumn>
                <FlexColumn
                    className="danger-zone"
                    alignContent="center"
                    gap={30}
                >
                    <Divider>Danger Zone</Divider>
                    <FlexRow gap={15}>
                        <label>Delete account permanently?</label>
                        <Button type="danger" icon="delete">
                            Delete
                        </Button>
                    </FlexRow>
                </FlexColumn>
            </FlexColumn>
        </Card>
    );
};

const resetPasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Password is required'),
    newPassword: Yup.string()
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
            'Password must contain at least one lowercase, uppercase, number and special character'
        )
        .min(8, value => `Password must be at least ${value.min} characters`)
        .required('Password is required'),
    confirmNewPassword: Yup.string().oneOf(
        [Yup.ref('newPassword')],
        'Passwords must match'
    ),
});

const PersonalSettings = () => {
    return (
        <Card
            className="personal-settings-section"
            title="Edit Personal Settings"
            bordered={false}
        >
            <Divider orientation="left">Associate Social Logins</Divider>
            <Divider orientation="left">Reset Password</Divider>
            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                }}
                validationSchema={resetPasswordSchema}
                onSubmit={() => {}}
            >
                {({ isSubmitting, isValid, dirty }) => (
                    <Form>
                        <FlexColumn gap={15}>
                            <FormItem name="currentPassword" label="Current">
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
                            </FormItem>
                            <FormItem
                                name="confirmNewPassword"
                                label="Confirm New Password"
                            >
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
                            </FormItem>
                            <SubmitButton
                                disabled={!dirty || !isValid}
                                loading={isSubmitting}
                            >
                                Confirm Reset
                            </SubmitButton>
                        </FlexColumn>
                    </Form>
                )}
            </Formik>
            <Divider orientation="left">Global Constants</Divider>
        </Card>
    );
};

const ProfileView = () => {
    const views = [ProfileSection, PersonalSettings];

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
                renderItem={Item => (
                    <List.Item>
                        <Item />
                    </List.Item>
                )}
            />
        </FlexRow>
    );
};

export default ProfileView;
