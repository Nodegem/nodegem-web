import './ControlViews.less';

import { Input, Switch, Tooltip } from 'antd';
import * as React from 'react';

import { NumericInput } from './NumericInput';
import { TextAreaModal } from './TextAreaModal';

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

            case "Boolean": 
                return <Switch onChange={this.handleValueChange} checked={value} />

            case "Number":
                return <NumericInput onChange={this.handleValueChange} onBlur={this.handleBlur} size="small" placeholder={name} value={value} />

            case "TextArea":
                return <TextAreaModal onChange={this.handleValueChange} value={value} label={name} title={name} />

            case "Text":
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