import classNames from 'classnames';
import React, { useState } from 'react';

import { Button } from 'antd';
import { ArrowIcon } from 'styles/icons';
import './CustomCollapsible.less';

type TDirection = 'left' | 'right' | 'top' | 'bottom';

interface IVerticalCollapsibleProps {
    size?: string | number;
    minSize?: string | number;
    tabSize?: string | number;
    direction?: TDirection;
    collapsed: boolean;
    onTabClick?: () => void;
    transitionSpeed?: number;
    children: React.ReactNode;
    className?: string;
}

export const CustomCollapsible: React.FC<IVerticalCollapsibleProps> = ({
    size = '15vw',
    minSize,
    tabSize = 0,
    direction = 'right',
    collapsed,
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

    const actualSize = size;
    size = collapsed ? tabSize : size;

    return vertical ? (
        <div
            className={containerClass}
            style={
                {
                    '--transition-speed':
                        transitionSpeed && `${transitionSpeed}ms`,
                    '--content-size': actualSize,
                    '--content-min-size': minSize,
                } as any
            }
            onTransitionEnd={() => setCollapsing(false)}
        >
            <div className={collapseClass}>{children}</div>
            <div className="tab-trigger" onMouseUp={onTabClick}>
                <ArrowIcon />
            </div>
        </div>
    ) : (
        <div
            className={containerClass}
            style={
                {
                    '--transition-speed':
                        transitionSpeed && `${transitionSpeed}ms`,
                    '--content-size': actualSize,
                    '--content-min-size': minSize,
                } as any
            }
            onTransitionEnd={() => setCollapsing(false)}
        >
            <div className={collapseClass}>{children}</div>
            <div className="tab-trigger" onMouseUp={onTabClick}>
                <div className="tab-trigger-container">
                    <Button type="primary" icon="double-right" />
                </div>
            </div>
        </div>
    );
};
