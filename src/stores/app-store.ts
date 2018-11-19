import { SiderTheme } from 'antd/lib/layout/Sider';
import { action, observable } from 'mobx';
class AppStore {

    @observable
    theme: SiderTheme = 'dark';

    @observable
    collapsed: boolean = false;

    @observable
    selectedPaths: Array<string>;

    public setSelectedPath = action((path: any) => {
        this.selectedPaths = path;
    });

    public toggleCollapsed = action(() => {
        this.collapsed = !this.collapsed;
    })

    public toggleTheme = action(() => {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
    })

}

export const appStore = new AppStore();