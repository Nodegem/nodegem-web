import * as React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { valueMap } from 'src/utils/value-type-mapper';

const Option = Select.Option;

interface ValueTypeDropDownProps extends SelectProps {}

export const ValueTypeDropDown = (props: ValueTypeDropDownProps) => {
    return (
        <Select {...props} placeholder="Type">
            {Object.keys(valueMap).map(x => (
                <Option value={x} key={x}>
                    {valueMap[x]}
                </Option>
            ))}
        </Select>
    );
};
