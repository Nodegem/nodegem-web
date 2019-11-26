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
    logs: LogData[];
}

export class LogsStore extends Store<ILogState, SandboxStore> {
    public state: ILogState = {
        isOpen: false,
        isLoading: false,
        connected: false,
        connecting: false,
        logs: [],
    };

    public get currentLogs(): LogData[] {
        return this.state.logs;
    }

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
            const newLog = {
                ...data,
                timestamp: moment.now(),
            };
            this.ctx.tabsStore.addLogsToTab(data.graphId, newLog);
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

    public setLogs = (logs: LogData[]) => {
        this.setState({ logs });
    };

    public toggleOpen = (value?: boolean) => {
        this.setState({ isOpen: this.state.isOpen.toggle(value) });

        if (value) {
            this.ctx.tabsStore.markAsRead();
        }
    };
}
