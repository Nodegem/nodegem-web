import * as React from "react";
import { observer } from "mobx-react";

@observer
class DashboardView extends React.Component {

    public render() {

        return (
            <div className="dashboard">
                <span>Dashboard</span>
            </div>
        );
    }

}

export default DashboardView;