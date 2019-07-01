import './Profile.less';

import { Avatar, Divider } from 'antd';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { UserStore } from 'src/stores/user-store';

interface IProfileViewProps {
    userStore?: UserStore;
}

@inject('userStore')
@observer
class ProfileView extends React.Component<IProfileViewProps> {
    public render() {
        const { user } = this.props.userStore!;
        const { userName } = user!;

        return (
            <div className="profile">
                <div className="profile-meta">
                    <span id="icon">
                        <Avatar size={96} icon="user" />
                    </span>
                    <span id="username">{userName}</span>
                </div>
            </div>
        );
    }
}

export default ProfileView;
