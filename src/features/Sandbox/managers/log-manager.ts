import { XTerm } from 'components';
import { computed, observable } from 'mobx';
import { TabManager } from './tab-manager';

export class LogManager {
    private xterm: XTerm;

    @observable
    public logs: { [id: string]: LogData[] } = {};

    @computed
    public get unreadLogCount(): number {
        return this.activeTabLogs.count(x => !!x.unread);
    }

    private get activeTabLogs(): LogData[] {
        if (this.tabManager.activeTab) {
            const { graph } = this.tabManager.activeTab;
            return this.logs[graph.id] ? this.logs[graph.id] : [];
        }

        return [];
    }

    constructor(private tabManager: TabManager) {}

    public setXterm = (xterm: XTerm) => {
        this.xterm = xterm;
    };

    public markAllAsRead = () => {
        this.activeTabLogs.forEach(l => (l.unread = false));
    };

    public addLog = (id: string, log: LogData | LogData[]) => {
        if (!this.logs[id]) {
            this.logs[id] = [];
        }

        const logs = Array.isArray(log) ? log : [log];

        this.logs[id].push(...logs);
        logs.forEach(l => {
            const terminal = this.xterm.getTerminal();
            console.log(terminal, this.xterm);
            terminal.writeln('test');
        });
    };
}
