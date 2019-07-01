import { SiderTheme } from 'antd/lib/layout/Sider';
import { action, observable } from 'mobx';
import { ignore } from 'mobx-sync';

class CommonStore {
    // This is a hack around some weird sider bug with ant-design
    @ignore
    @observable
    public collapsedToggleOnce = false;

    @observable public collapsed: boolean;
    @observable public theme: SiderTheme = 'dark';

    @ignore
    @observable
    public collapseWidth?: number;

    @ignore
    @observable
    public siderWidth: number = 200;

    @ignore
    @observable
    public broken: boolean;

    @action public changeTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
    }

    @action public setBreakpoint(broken: boolean) {
        this.broken = broken;

        if (broken) {
            this.siderWidth = 150;
            this.collapseWidth = 0;
        } else {
            this.siderWidth = 200;
            this.collapseWidth = undefined;
        }
    }

    @action public toggleCollapsed() {
        // This bullshit is because of some ant design bug
        // where this function gets called twice on load and toggles off
        if (!this.collapsedToggleOnce && this.collapsed) {
            this.collapsedToggleOnce = true;
            return;
        } else {
            this.collapsedToggleOnce = true;
        }

        this.collapsed = !this.collapsed;
    }
}

export default new CommonStore();

export { CommonStore };
