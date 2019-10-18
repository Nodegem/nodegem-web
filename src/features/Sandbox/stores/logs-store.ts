import { Store } from 'overstated';
import { SandboxStore } from '.';

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

    public get canToggle(): boolean {
        return !this.state.isLoading;
    }

    public toggleOpen = (value?: boolean) => {
        this.setState({ isOpen: this.state.isOpen.toggle(value) });
    };

    public toggleHasUnread = (value?: undefined) => {
        this.setState({ hasUnread: this.state.hasUnread.toggle(value) });
    };
}
