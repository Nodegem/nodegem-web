import { SiderTheme } from 'antd/lib/layout/Sider';
import { action, observable } from 'mobx';
import { ignore } from 'mobx-sync';

class CommonStore {
    @observable public collapsed: boolean = true;
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

    @action public toggleCollapsed(toggle: boolean) {
        this.collapsed = toggle;
    }
}

export default new CommonStore();

export { CommonStore };
