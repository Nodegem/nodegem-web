import React from 'react';

import classNames from 'classnames';
import { FlexDirectionProperty, FlexWrapProperty } from 'csstype';
import './Flex.less';

type AlignmentOptions = 'start' | 'center' | 'end';

interface IFlexProps extends React.HTMLAttributes<HTMLDivElement> {
    flex?: number | string;
    height?: number;
    gap?: number;
    direction?: FlexDirectionProperty;
    wrap?: FlexWrapProperty;
    justifyContent?: AlignmentOptions;
    alignContent?: AlignmentOptions;
}

export const Flex: React.FC<IFlexProps> = ({
    flex = '1 1 auto',
    gap = 0,
    direction,
    wrap,
    alignContent,
    justifyContent,
    children,
    style,
    className,
    ...rest
}) => {
    return (
        <div
            {...rest}
            className={classNames({
                [className as any]: !!className,
                'flex-container': true,
                [`flex-${direction}`]: !!direction,
            })}
            style={
                {
                    display: 'flex',
                    flex: typeof flex === 'number' ? `1 1 ${flex}%` : flex,
                    flexDirection: direction,
                    flexWrap: wrap,
                    alignItems:
                        alignContent === 'start'
                            ? 'flex-start'
                            : alignContent === 'end'
                            ? 'flex-end'
                            : alignContent,
                    justifyContent:
                        justifyContent === 'start'
                            ? 'flex-start'
                            : justifyContent === 'end'
                            ? 'flex-end'
                            : justifyContent,
                    ...style,
                } as any
            }
        >
            {React.Children.map(
                children,
                child =>
                    !!child &&
                    React.cloneElement(child as any, {
                        style: {
                            marginRight:
                                direction === 'row' ? `${gap}px` : undefined,
                            marginBottom:
                                direction === 'column' ? `${gap}px` : undefined,
                        },
                    })
            )}
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
    <Flex {...rest}>{children}</Flex>
);

export const FlexFillGreedy: React.FC<IFlexProps> = ({ children, ...rest }) => (
    <Flex flex="1 1 100%" {...rest}>
        {children}
    </Flex>
);
