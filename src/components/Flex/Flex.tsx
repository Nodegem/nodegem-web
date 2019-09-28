import React from 'react';

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
    direction = 'row',
    wrap = 'initial',
    children,
    style,
    ...rest
}) => {
    const flexGrowValue = flexGrow ? 1 : 0;
    const flexShrinkValue = flexShrink ? 1 : 0;
    return (
        <div
            {...rest}
            style={{
                display: 'flex',
                flexBasis: flex ? `${flex}%` : 'auto',
                flexGrow: flexGrowValue,
                flexShrink: flexShrinkValue,
                flexDirection: direction,
                flexWrap: wrap,
                ...style,
            }}
        >
            {React.Children.map(children, child =>
                React.cloneElement(child as React.ReactElement<any>, {
                    marginBottom: `${gap}px`,
                })
            )}
        </div>
    );
};

export const FlexRow: React.FC<IFlexProps> = ({ children, ...rest }) => (
    <Flex {...rest}>{children}</Flex>
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
