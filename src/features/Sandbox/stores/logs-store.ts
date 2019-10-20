import { Store } from 'overstated';
import { SandboxStore } from '.';
import TerminalHub from '../hubs/terminal-hub';

interface ILogState {
    logs: LogData[];
    isOpen: boolean;
    isLoading: boolean;
    hasUnread: boolean;
}

export class LogsStore extends Store<ILogState, SandboxStore> {
    public state = {
        logs: [],
        isOpen: false,
        isLoading: false,
        hasUnread: false,
    };

    private terminalHub: TerminalHub;

    constructor() {
        super();
        this.terminalHub = new TerminalHub();
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
