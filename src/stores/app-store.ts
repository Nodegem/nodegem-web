import { observable, action } from "mobx";
import { MenuTheme } from "antd/lib/menu";

class AppStore implements IAppStore {

    @observable collapsed: boolean = false;
    @observable theme: MenuTheme = "dark";

    @action changeTheme() {
        this.theme = this.theme === "dark" ? "light" : "dark";
    }

    @action toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }

}

export default new AppStore();