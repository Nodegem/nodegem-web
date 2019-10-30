import moment from 'moment';
import { Store } from 'overstated';
import { appStore } from 'stores';
import { SandboxStore } from '.';
import TerminalHub from '../hubs/terminal-hub';

interface ILogState {
    isOpen: boolean;
    isLoading: boolean;
    connected: boolean;
    connecting: boolean;
}

export class LogsStore extends Store<ILogState, SandboxStore> {
    public state: ILogState = {
        isOpen: false,
        isLoading: false,
        connected: false,
        connecting: false,
    };

    public terminalHub: TerminalHub = new TerminalHub();

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
            this.ctx.tabsStore.addLogsToTab(data.graphId, {
                ...data,
                timestamp: moment.now(),
            });
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
            this.ctx.tabsStore.markAsRead();
        }
    };
}
