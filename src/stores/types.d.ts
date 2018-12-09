interface IAppStore {

    collapsed: boolean;
    theme: "light" | "dark";

    changeTheme: () => void;
    toggleCollapsed: () => void;

}

interface IUserStore {
    isLoggedIn: boolean;
}