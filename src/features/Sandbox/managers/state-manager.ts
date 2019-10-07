import { computed } from 'mobx';
import { TabManager } from './tab-manager';

export class StateManager {
    @computed
    public get isDirty(): boolean {
        if (this.tabManager.hasActiveTab) {
            return this._changes[this.tabManager.activeGraph!.id].length > 1;
        }

        return false;
    }

    private _changes: { [graphId: string]: GraphState[] } = {};

    constructor(private tabManager: TabManager) {}

    public updateState(state: GraphState) {
        if (this.tabManager.hasActiveTab) {
            if (this._changes[this.tabManager.activeGraph!.id]) {
                this._changes[this.tabManager.activeGraph!.id].push(state);
            } else {
                this._changes[this.tabManager.activeGraph!.id] = [state];
            }
        }
    }

    public undo(): GraphState | undefined {
        if (this.tabManager.hasActiveTab) {
            if (this._changes[this.tabManager.activeGraph!.id]) {
                return this._changes[this.tabManager.activeGraph!.id].pop();
            }
        }

        return undefined;
    }
}
