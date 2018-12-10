import { observable, action } from "mobx";
import { SiderTheme } from "antd/lib/layout/Sider";
import { ignore } from "mobx-sync";

class CommonStore {

    @observable collapsed: boolean;
    @observable theme: SiderTheme = "dark";

    @ignore
    @observable
    collapseWidth?: number;

    @ignore
    @observable
    siderWidth: number = 200;

    @ignore
    @observable
    broken: boolean;

    @action changeTheme() {
        this.theme = this.theme === "dark" ? "light" : "dark";
    }

    @action setBreakpoint(broken: boolean) {
        this.broken = broken;

        if(broken) {
            this.siderWidth = 150;
            this.collapseWidth = 0;
        } else {
            this.siderWidth = 200;
            this.collapseWidth = undefined;
        }
    }

    @action toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }

}

export default new CommonStore();

export { CommonStore };