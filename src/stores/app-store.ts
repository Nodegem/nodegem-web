import { observable, action } from "mobx";
import { MenuTheme } from "antd/lib/menu";
import { ignore } from "mobx-sync";
import { CollapseType } from "antd/lib/layout/Sider";

class AppStore {

    @observable collapsed: boolean = false;
    @observable theme: MenuTheme = "dark";

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

    @action toggleCollapsed(toggle: boolean) {
        this.collapsed = toggle;
    }

}

export default new AppStore();
export { AppStore }