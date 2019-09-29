import { XTerm } from 'components';
import { computed, observable } from 'mobx';
import { TabManager } from './tab-manager';

export class LogManager {
    private xterm: XTerm;

    @observable
    public logs: { [id: string]: LogData[] } = {};

    constructor(private tabManager: TabManager) {}

    @computed
    public get unreadLogCount(): number {
        if (this.tabManager.activeTab) {
            return this.logs[this.tabManager.activeTab.graph.id].count(
                x => !!x.unread
            );
        }

        return 0;
    }

    public setXterm = (xterm: XTerm) => {
        this.xterm = xterm;
    };

    public addLog = (id: string, log: LogData | LogData[]) => {
        if (!this.logs[id]) {
            this.logs[id] = [];
        }

        if (Array.isArray(log)) {
            this.logs[id].push(...log);
        } else {
            this.logs[id].push(log);
        }
    };
}
