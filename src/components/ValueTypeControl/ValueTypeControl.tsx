import * as React from 'react';
import { Select } from 'antd';

const Option = Select.Option;

interface ValueTypeControlProps {}

export const ValueTypeControl = ({  }: ValueTypeControlProps) => {
    return (
        <Select placeholder="Type" defaultValue="object">
            <Option value="object">Object</Option>
        </Select>
    );
};
