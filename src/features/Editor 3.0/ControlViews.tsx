import * as React from "react";
import { Input } from "antd";

type NumControlProps = { name: string, controlKey: string, getData: (key: string) => void, putData: (key: string, value: any) => void }
class NumControl extends React.Component<NumControlProps> {

    private handleChange = (e) => {
        if(e.target) {
            this.props.putData(this.props.controlKey, e.target.value);
            this.forceUpdate();
        }
    }

    public render() {

        const { name } = this.props;

        return (
            <Input onChange={this.handleChange} placeholder={name} type="text" />
        );
    }

}

export {
    NumControl
}