import { SiderTheme } from 'antd/lib/layout/Sider';
import { action, computed, observable } from 'mobx';


class CommonStore {
    @observable public collapsed: boolean = true;
    @observable public theme: SiderTheme = 'dark';

    
    @computed
    public get collapseWidth(): number | undefined {
        return this.broken ? 0 : undefined;
    }

    
    @computed
    public get siderWidth(): number {
        return this.broken ? 120 : 200;
    }

    
    @observable
    public broken: boolean;

    @action public changeTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
    }

    @action public toggleCollapsed(toggle: boolean) {
        this.collapsed = toggle;
    }

    @action public setBreakpoint(broken: boolean) {
        this.broken = broken;
    }
}

export default new CommonStore();

export { CommonStore };
