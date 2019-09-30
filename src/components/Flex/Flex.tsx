import React from 'react';

import classNames from 'classnames';
import { FlexDirectionProperty, FlexWrapProperty } from 'csstype';
import './Flex.less';

interface IFlexProps extends React.HTMLAttributes<HTMLDivElement> {
    flex?: number;
    height?: number;
    gap?: number;
    flexGrow?: boolean;
    flexShrink?: boolean;
    direction?: FlexDirectionProperty;
    wrap?: FlexWrapProperty;
}

export const Flex: React.FC<IFlexProps> = ({
    flex,
    gap = 0,
    flexGrow = true,
    flexShrink = true,
    direction,
    wrap,
    children,
    style,
    className,
    ...rest
}) => {
    const flexGrowValue = flexGrow ? 1 : 0;
    const flexShrinkValue = flexShrink ? 1 : 0;
    return (
        <div
            {...rest}
            className={classNames({
                [className as any]: true,
                'flex-container': true,
                [`flex-${direction}`]: true,
            })}
            style={
                {
                    '--flex-gap': `${gap}px`,
                    display: 'flex',
                    flexBasis: flex ? `${flex}%` : 'auto',
                    flexGrow: flexGrowValue,
                    flexShrink: flexShrinkValue,
                    flexDirection: direction,
                    flexWrap: wrap,
                    ...style,
                } as any
            }
        >
            {children}
        </div>
    );
};

export const FlexRow: React.FC<IFlexProps> = ({ children, ...rest }) => (
    <Flex {...rest} direction="row">
        {children}
    </Flex>
);

export const FlexColumn: React.FC<IFlexProps> = ({ children, ...rest }) => (
    <Flex {...rest} direction="column">
        {children}
    </Flex>
);

export const FlexRowMax: React.FC<IFlexProps> = ({ children, ...rest }) => (
    <Flex {...rest} direction="row" style={{ width: '100%' }}>
        {children}
    </Flex>
);

export const FlexColumnMax: React.FC<IFlexProps> = ({ children, ...rest }) => (
    <Flex {...rest} direction="column" style={{ height: '100%' }}>
        {children}
    </Flex>
);

export const FlexFill: React.FC<IFlexProps> = ({ children, ...rest }) => (
    <Flex {...rest} flexGrow flexShrink>
        {children}
    </Flex>
);
