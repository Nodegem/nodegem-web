import './Profile.less';

import { Avatar } from 'antd';
import { useStore } from 'overstated';
import * as React from 'react';
import { appStore } from 'stores';

const ProfileView = () => {
    const { user } = useStore(appStore.userStore, store => ({
        user: store.user,
    }));

    return (
        <div className="profile">
            <div className="profile-meta">
                <span id="icon">
                    <Avatar
                        size={128}
                        shape="square"
                        icon="user"
                        src={user.avatarUrl}
                    />
                </span>
                <span id="username">{user.userName}</span>
            </div>
        </div>
    );
};

export default ProfileView;
