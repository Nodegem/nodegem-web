import './Profile.less';

import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Avatar } from 'antd';

@inject()
@observer
class ProfileView extends React.Component {

    public render() {
        return (
            <div className="profile">

                <div className="profile-meta">
                    <span id="icon"><Avatar size={96} icon="user" /></span>
                    <span id="username">User</span>
                </div>

            </div>
        )
    }

}

export default ProfileView;