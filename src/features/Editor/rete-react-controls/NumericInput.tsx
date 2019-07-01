import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
import * as React from 'react';

interface INumericInputProps extends InputProps {
    value: any;
    onBlur: () => void;
    onChange: (value: any) => void;
}

class NumericInput extends React.Component<INumericInputProps> {
    public onChange = e => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if (
            (!isNaN(value) && reg.test(value)) ||
            value === '' ||
            value === '-'
        ) {
            this.props.onChange(value);
        }
    };

    // '.' at the end or only '-' in the input box.
    public onBlur = () => {
        const { value, onBlur, onChange } = this.props;

        if (value) {
            if (value.charAt(value.length - 1) === '.' || value === '-') {
                onChange({ value: value.slice(0, -1) });
            }
        }

        if (onBlur) {
            onBlur();
        }
    };

    public render() {
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

export { NumericInput };
