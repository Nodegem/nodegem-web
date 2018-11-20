import * as React from "react";
import { Input } from "antd";

import './ControlViews.less';

type ReteControlProps = { name: string, controlKey: string, defaultValue: any, getData: (key: string) => any, putData: (key: string, value: any) => void }
class ReteControlView extends React.Component<ReteControlProps> {

    componentDidMount() {
        const { putData, controlKey, defaultValue } = this.props;

        if(defaultValue != null) {
            putData(controlKey, defaultValue);
            this.forceUpdate();
        }
    }

    private handleChange = (e) => {
        if(e.target) {
            this.props.putData(this.props.controlKey, e.target.value);
            this.forceUpdate();
        }
    }

    public render() {
        const { name, controlKey, getData } = this.props;
        const value = getData(controlKey);
        return (
            <Input title={name} onChange={this.handleChange} placeholder={name} value={value} type="text" />
        );
    }

}

export {
    ReteControlView
}