import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import { IPersistableStore } from 'resub-persist/dist';
import { SiderTheme } from 'antd/lib/layout/Sider';

@AutoSubscribeStore
class AppStore extends StoreBase implements IPersistableStore {

    name: string = "AppStore";
    getPropKeys() { return ["_siderCollapsed", "_siderTheme", "_selectedKeys"] };

    private _siderCollapsed : boolean = true;
    private _siderTheme : SiderTheme = "dark";
    private _selectedKeys : string[] = ["dashboard"];

    public setSelectedKeys(...keys: string[]) {
        this._selectedKeys = keys;
        this.trigger();
    }

    @autoSubscribe
    public getSelectedKeys() {
        return this._selectedKeys;
    }

    public setSiderTheme(theme: SiderTheme) {
        this._siderTheme = theme;
        this.trigger();
    }

    @autoSubscribe
    public getSiderTheme() {
        return this._siderTheme;
    }

    public setSiderCollapsed(toggle: boolean) {
        this._siderCollapsed = toggle;
        this.trigger();
    }

    @autoSubscribe
    public getSiderCollapsed() {
        return this._siderCollapsed;
    }

}

export const appStore = new AppStore();