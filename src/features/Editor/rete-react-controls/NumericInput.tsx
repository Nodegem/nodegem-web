import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import * as React from 'react';

// function formatNumber(value) {
//     value += "";
//     const list = value.split(".");
//     const prefix = list[0].charAt(0) === "-" ? "-" : "";
//     let num = prefix ? list[0].slice(1) : list[0];
//     let result = "";
//     while (num.length > 3) {
//         result = `,${num.slice(-3)}${result}`;
//         num = num.slice(0, num.length - 3);
//     }
//     if (num) {
//         result = num + result;
//     }
//     return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
// }

interface NumericInputProps extends InputProps {
    value: any;
    onBlur: () => void;
    onChange: (value: any) => void;
}

class NumericInput extends React.Component<NumericInputProps> {

    onChange = e => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if (
            (!isNaN(value) && reg.test(value)) ||
            value === "" ||
            value === "-"
        ) {
            this.props.onChange(value);
        }
    };

    // '.' at the end or only '-' in the input box.
    onBlur = () => {
        const { value, onBlur, onChange } = this.props;

        if(value) {
            if (value.charAt(value.length - 1) === "." || value === "-") {
                onChange({ value: value.slice(0, -1) });
            }
        }

        if (onBlur) {
            onBlur();
        }
    };

    render() {

        return (
            <Input
                {...this.props}
                onChange={this.onChange}
                onBlur={this.onBlur}
                maxLength={25}
            />
        );
    }
}

export { NumericInput }