import { notification } from 'antd';
import { ArgsProps, NotificationPlacement } from 'antd/lib/notification';

export const displayErrorNotification = (title: string, description: string,  props: ArgsProps = {} as ArgsProps) => {
    notification.error({
        message: title,
        description,
        ...props
    });
}