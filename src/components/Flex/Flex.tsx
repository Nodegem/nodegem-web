import React from 'react';

interface IFlexProps {}

export const Flex: React.FC<IFlexProps> = ({ children }) => {
    return <div>{children}</div>;
};
