import moment from 'moment';
import { Store } from 'overstated';
import { SandboxStore } from '.';
import TerminalHub from '../hubs/terminal-hub';
import { appStore } from './../../../app-state-store';

interface ILogState {
    isOpen: boolean;
    isLoading: boolean;
    hasUnread: boolean;
    connected: boolean;
    connecting: boolean;
}

export class LogsStore extends Store<ILogState, SandboxStore> {
    public state: ILogState = {
        isOpen: false,
        isLoading: false,
        hasUnread: false,
        connected: false,
        connecting: false,
    };

    private terminalHub: TerminalHub = new TerminalHub();

    constructor() {
        super();

        this.terminalHub.onConnecting.subscribe(() => {
            this.setState({ connected: false, connecting: true });
        });

        this.terminalHub.onReconnecting.subscribe(() => {
            this.setState({ connecting: true, connected: false });
        });

        this.terminalHub.onReconnected.subscribe(() => {
            this.setState({ connected: true, connecting: false });
        });

        this.terminalHub.onConnected.subscribe(() => {
            this.setState({ connected: true, connecting: false });
        });

        this.terminalHub.log.subscribe(data => {
            if (this.ctx.tabsStore.hasActiveTab) {
                this.ctx.tabsStore.addLogsToCurrentTab([
                    {
                        ...data,
                        timestamp: moment.now(),
                    },
                ]);

                this.toggleHasUnread(!this.state.isOpen);
            }
        });

        this.terminalHub.onDisconnected.subscribe(() => {
            appStore.toast('Lost logs service connection', 'error');
            this.setState({ connected: false, connecting: false });
        });

        this.terminalHub.start();
    }

    public get canToggle(): boolean {
        return !this.state.isLoading;
    }

    public toggleOpen = (value?: boolean) => {
        this.setState({ isOpen: this.state.isOpen.toggle(value) });
        if (value) {
            this.toggleHasUnread(false);
        }
    };

    public toggleHasUnread = (value?: boolean) => {
        this.setState({ hasUnread: this.state.hasUnread.toggle(value) });
    };
}
