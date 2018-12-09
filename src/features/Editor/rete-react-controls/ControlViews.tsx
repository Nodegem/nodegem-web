import * as React from "react";
import { Input, Tooltip, Modal, InputNumber, Checkbox, Switch } from "antd";

import './ControlViews.less';
import { TextAreaModal } from "./TextAreaModal";
import { NumericInput } from "./NumericInput";


interface ReteControlProps { 
    name: string;
    controlKey: string;
    defaultValue: any;
    valueType: ValueType;
    getData: (key: string) => any;
    putData: (key: string, value: any) => void;
}

class ReteControlView extends React.Component<ReteControlProps, { value: any }> {

    state = {
        value: undefined
    }

    componentDidMount() {
        const { putData, controlKey, defaultValue } = this.props;

        if(defaultValue != null) {
            putData(controlKey, defaultValue);
            this.setState({ value: defaultValue });
        }
    }

    private handleChange = (e) => {
        if(e.target) {
            const value = e.target.value;
            this.handleValueChange(value);
        }
    }

    private handleValueChange = (value) => {
        this.setState({ value: value }, () => {
            this.props.putData(this.props.controlKey, value);
        });
    }

    private handleBlur = () => { }

    private renderControl = () => {
        const { name, valueType } = this.props;
        const { value } = this.state;

        switch(valueType) {

            case ValueType.Boolean: 
                return <Switch onChange={this.handleValueChange} checked={value} />

            case ValueType.Number:
                return <NumericInput onChange={this.handleValueChange} onBlur={this.handleBlur} size="small" placeholder={name} value={value} />

            case ValueType.TextArea:
                return <TextAreaModal onChange={this.handleValueChange} value={value} label={name} title={name} />

            case ValueType.Text:
            default:
                return <Input onChange={this.handleChange} placeholder={name} value={value} type="text" size="small" />
        }

    }

    public render() {
        const { name } = this.props;

        return (
            <Tooltip title={name} placement="right">
            {
                this.renderControl()
            }
            </Tooltip>
        );
    }

}

export {
    ReteControlView
}