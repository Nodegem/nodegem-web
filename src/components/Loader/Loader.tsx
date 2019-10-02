import { Icon, Spin } from 'antd';
import { Flex } from 'components/Flex';
import React from 'react';

import './Loader.less';

const antIcon = (size: number) => (
    <Icon type="loading" style={{ fontSize: `${size}vw` }} spin />
);

interface ILoaderProps {
    size?: number;
    textSize?: number;
}

export const Loader: React.FC<ILoaderProps> = ({ size = 5, textSize = 1 }) => (
    <Flex
        className="loading-spinner"
        style={{ '--loading-text-size': `${textSize}vw` } as any}
        flex={100}
        flexGrow
        flexShrink
    >
        <Spin indicator={antIcon(size)} />
    </Flex>
);
