import * as React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { valueMap } from 'src/utils/value-type-mapper';

const Option = Select.Option;

interface ValueTypeControlProps extends SelectProps {}

export const ValueTypeControl = (props: ValueTypeControlProps) => {
    return (
        <Select placeholder="Type">
            {Object.keys(valueMap).map(x => (
                <Option value={x}>{valueMap[x]}</Option>
            ))}
        </Select>
    );
};
