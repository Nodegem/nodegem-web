import { message, notification } from 'antd';
import { MenuTheme } from 'antd/lib/menu/MenuContext';
import { ArgsProps, NotificationPlacement } from 'antd/lib/notification';
import { compose, Store } from 'overstated';
import { UserStore } from './user-store';

interface IAppState {
    selectedGraph?: Graph | Macro;
    theme: MenuTheme;
    windowHandle: Window | null;
}

type NoticeType = 'success' | 'info' | 'warn' | 'error';
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

interface IAppChildren {
    userStore: UserStore;
}

@compose({
    userStore: UserStore,
})
export class AppStore extends Store<IAppState, undefined, IAppChildren> {
    public state: IAppState = {
        theme: 'dark',
        windowHandle: null,
    };

    public loadStateFromStorage = async () => {
        await this.userStore.loadStateFromStorage();
    };

    public get hasSelectedGraph(): boolean {
        return !!this.state.selectedGraph;
    }

    public setSelectedGraph = (graph: Graph | Macro) => {
        this.setState({ selectedGraph: graph });
    };

    public clearSelectedGraph = () => {
        this.setState({ selectedGraph: undefined });
    };

    public setWindowHandle = (windowHandle: Window | null) => {
        this.setState({ windowHandle });
    };

    public openNotification = ({
        title,
        description,
        key,
        type = 'info',
        onClick,
        duration = 4.5,
        placement = 'topLeft',
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

    public toast = (
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
}

export const appStore = new AppStore();
