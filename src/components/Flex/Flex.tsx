import React from 'react';

import './Flex.less';

interface IFlexProps {}

export const Flex: React.FC<IFlexProps> = ({ children }) => {
    return <div>{children}</div>;
};
