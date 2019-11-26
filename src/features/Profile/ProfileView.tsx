import './Profile.less';

import { Avatar, Button, Card, Divider } from 'antd';
import { FlexColumn, FlexFillGreedy, FlexRow } from 'components';
import { useStore } from 'overstated';
import * as React from 'react';
import { appStore } from 'stores';

const ProfileView = () => {
    const { user } = useStore(appStore.userStore, store => ({
        user: store.user,
    }));

    return (
        <FlexRow className="profile" gap={30}>
            <Card
                className="profile-section"
                title="Your Profile"
                bordered={false}
                style={{ flex: '1 1 50%' }}
            >
                <FlexColumn>
                    <FlexColumn className="account-avatar" gap={20}>
                        <Avatar size={128} icon="user" src={user.avatarUrl} />
                        <span className="username">{user.userName}</span>
                    </FlexColumn>
                    <FlexFillGreedy />
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
            <Card
                className="personal-settings-section"
                title="Edit Personal Settings"
                bordered={false}
                style={{ flex: '1 1 100%' }}
            >
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
            <Card
                className="social-login-section"
                title="Social Logins"
                bordered={false}
                style={{ flex: '1 1 auto', minWidth: '300px' }}
            >
                <p>Card content</p>
            </Card>
        </FlexRow>
    );
};

export default ProfileView;
