import { SiderTheme } from 'antd/lib/layout/Sider';
import { action, computed, observable } from 'mobx';
import { getFromStorage, saveToStorage } from 'utils';

class CommonStore {
    @observable public theme: SiderTheme = 'dark';
    public headerHeight: number = 52;

    constructor() {
        this.init();
    }

    @action
    public init() {
        this.theme = getFromStorage<SiderTheme>('theme')!;

        if (!this.theme) {
            this.changeTheme('dark');
        }
    }

    @action public changeTheme(theme?: SiderTheme) {
        this.theme =
            theme === undefined
                ? this.theme === 'dark'
                    ? 'light'
                    : 'dark'
                : 'dark';
        saveToStorage('theme', this.theme);
    }
}

export default new CommonStore();

export { CommonStore };
