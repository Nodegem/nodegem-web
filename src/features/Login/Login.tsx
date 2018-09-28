import * as React from "react";
import { loginService } from "./login-service";
import { userStore } from "../../stores/user-store";
import { withRouter, RouteComponentProps } from "react-router";

class LoginView extends React.Component<RouteComponentProps<any>> {

    componentDidMount() {
        const response = loginService.login({ username: "rszemplinski22@gmail.com", password: "Passwordbo!3000" });
        response.then(data => {
            userStore.setToken(data.token);
            userStore.setUserData(data.user);
        })
    }

    public render() {
        return (<div />)
    }

}

export default withRouter(LoginView)