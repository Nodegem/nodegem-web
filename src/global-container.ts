import { message, notification } from 'antd';
import { ArgsProps, NotificationPlacement } from 'antd/lib/notification';
import { useState } from 'react';

interface IGlobalState {
    selectedGraph?: { id: string; type: GraphType };
}

type NoticeType = 'success' | 'info' | 'warn' | 'error';
const toast = (
    msg: string,
    type: NoticeType = 'success',
    duration: number = 3
) => {
    switch (type) {
        case 'info':
            message.info(msg, duration);
            break;
        case 'success':
            message.success(msg, duration);
            break;
        case 'warn':
            message.warning(msg, duration);
            break;
        case 'error':
            message.error(msg, duration);
            break;
    }
};

interface INotifyOptions {
    title: string;
    description: string;
    type?: NoticeType;
    key?: string;
    onClick?: () => void;
    duration?: number;
    placement?: NotificationPlacement;
    closeBtn?: React.ReactNode;
    icon?: React.ReactNode;
}

const openNotification = ({
    title,
    description,
    key,
    type = 'info',
    onClick,
    duration = 4.5,
    placement = 'bottomRight',
    closeBtn,
    icon,
}: INotifyOptions) => {
    const argProps: ArgsProps = {
        key,
        message: title,
        description,
        onClick,
        duration,
        icon,
        btn: closeBtn,
        placement,
    };

    switch (type) {
        case 'success':
            notification.success(argProps);
            break;
        case 'info':
            notification.info(argProps);
            break;
        case 'warn':
            notification.warn(argProps);
            break;
        case 'error':
            notification.error(argProps);
            break;
        default:
            notification.open(argProps);
            break;
    }
};

function useGlobal(initialState: IGlobalState) {
    const [state, setState] = useState(initialState || {});
    const setSelected = (id: string, type: GraphType) =>
        setState({ selectedGraph: { id, type } });
    return { ...state, toast, openNotification, setSelected };
}

export const GlobalContainer = createContainer(useGlobal);
