import { SiderTheme } from 'antd/lib/layout/Sider';
import { action, computed, observable } from 'mobx';
import { getFromStorage, saveToStorage } from 'utils';

class CommonStore {
    @observable public collapsed: boolean = true;
    @observable public theme: SiderTheme = 'dark';

    constructor() {
        this.theme = getFromStorage<SiderTheme>('theme')!;
        this.collapsed = getFromStorage<boolean>('siderCollapsed')!;
    }

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
        saveToStorage('theme', this.theme);
    }

    @action public toggleCollapsed(toggle: boolean) {
        this.collapsed = toggle;
        saveToStorage('siderCollapsed', this.collapsed);
    }

    @action public setBreakpoint(broken: boolean) {
        this.broken = broken;
    }
}

export default new CommonStore();

export type TCommonStore = ReturnType<typeof createCommonStore>;
export function createCommonStore() {
    return {
        theme: 'dark' as SiderTheme,
        headerHeight: '52px',
    };
}

export { CommonStore };
