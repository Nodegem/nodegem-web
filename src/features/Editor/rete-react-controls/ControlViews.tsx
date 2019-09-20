import './ControlViews.less';

import { Input, Switch, Tooltip } from 'antd';
import * as React from 'react';

import { NumericInput } from './NumericInput';
import { TextAreaModal } from './TextAreaModal';

interface IReteControlProps {
    name: string;
    controlKey: string;
    defaultValue: any;
    valueType: ValueType;
    getData: <T = any>(key: string) => T;
    putData: (key: string, value: any) => void;
}

class ReteControlView extends React.Component<
    IReteControlProps,
    { value: any }
> {
    public state = {
        value: undefined,
    };

    public componentDidMount() {
        const { putData, getData, controlKey, defaultValue } = this.props;

        const value = getData(controlKey);
        if (value) {
            this.setState({ value });
        } else if (defaultValue !== undefined && defaultValue !== null) {
            putData(controlKey, defaultValue);
            this.setState({ value: defaultValue });
        }
    }

    private handleChange = e => {
        if (e.target) {
            const value = e.target.value;
            this.handleValueChange(value);
        }
    };

    private handleValueChange = value => {
        this.setState({ value }, () => {
            this.props.putData(this.props.controlKey, value);
        });
    };

    private handleBlur = () => null;

    private renderControl = () => {
        const { name, valueType } = this.props;
        const { value } = this.state;

        switch (valueType) {
            // case 'Boolean':
            //     return (
            //         <Switch onChange={this.handleValueChange} checked={value} />
            //     );

            // case 'Number':
            //     return (
            //         <NumericInput
            //             onChange={this.handleValueChange}
            //             onBlur={this.handleBlur}
            //             size="small"
            //             placeholder={name}
            //             value={value}
            //         />
            //     );

            // case 'Text Area':
            //     return (
            //         <TextAreaModal
            //             onChange={this.handleValueChange}
            //             value={value}
            //             label={name}
            //             title={name}
            //         />
            //     );

            // case 'Text':
            default:
                return (
                    <Input
                        onChange={this.handleChange}
                        placeholder={name}
                        value={value}
                        type="text"
                        size="small"
                    />
                );
        }
    };

    public render() {
        const { name } = this.props;

        return (
            <Tooltip title={name} placement="right">
                {this.renderControl()}
            </Tooltip>
        );
    }
}

export { ReteControlView };
