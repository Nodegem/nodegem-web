import classNames from 'classnames';
import React, { useState } from 'react';

import './CustomCollapsible.less';

type TDirection = 'left' | 'right' | 'top' | 'bottom';

interface IVerticalCollapsibleProps {
    size?: string | number;
    tabSize?: string | number;
    direction?: TDirection;
    collapsed: boolean;
    onTabClick?: () => void;
    tabContent?: React.ReactNode;
    transitionSpeed?: number;
    children: React.ReactNode;
    className?: string;
}

export const CustomCollapsible: React.FC<IVerticalCollapsibleProps> = ({
    size = '15vw',
    tabSize = 0,
    direction = 'right',
    collapsed,
    tabContent,
    onTabClick = () => {},
    transitionSpeed,
    className,
    children,
}: IVerticalCollapsibleProps) => {
    const [collapsing, setCollapsing] = useState(false);

    const opening = collapsing && !collapsed;
    const closing = collapsing && collapsed;
    const fullyCollapsed = !collapsing && collapsed;

    const collapseClass = classNames({
        content: true,
        opening,
        closing,
        collapsed: fullyCollapsed,
    });

    const vertical = direction === 'top' || direction === 'bottom';

    const containerClass = classNames({
        [className as string]: !!className,
        'collapse-container': true,
        'tab-reverse': direction === 'left' || direction === 'bottom',
        vertical,
        horizontal: !vertical,
        opening,
        closing,
        collapsed: fullyCollapsed,
    });

    const handleTabClick = () => {
        setCollapsing(true);
        onTabClick();
    };

    const actualSize = size;
    size = collapsed ? tabSize : size;

    return vertical ? (
        <div
            className={containerClass}
            style={
                {
                    minHeight: tabSize,
                    height: size,
                    '--transition-speed':
                        transitionSpeed && `${transitionSpeed}ms`,
                    '--content-size': actualSize,
                } as any
            }
            onTransitionEnd={() => setCollapsing(false)}
        >
            <div className={collapseClass}>{children}</div>
        </div>
    ) : (
        <div
            className={containerClass}
            style={
                {
                    minWidth: tabSize,
                    width: size,
                    '--transition-speed':
                        transitionSpeed && `${transitionSpeed}ms`,
                    '--content-size': actualSize,
                } as any
            }
            onTransitionEnd={() => setCollapsing(false)}
        >
            <div className={collapseClass}>{children}</div>
        </div>
    );
};
