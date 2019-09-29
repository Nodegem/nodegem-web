import classNames from 'classnames';
import React from 'react';

import './HorizontalCollapse.less';

type TTabDirection = 'top' | 'bottom';

interface IHorizontalCollapseProps {
    height?: string | number;
    minHeight?: string | number;
    tabHeight?: string | number;
    tabDirection?: TTabDirection;
    collapsed: boolean;
    onTabClick?: () => void;
    tabContent?: React.ReactNode;
    children: React.ReactNode;
}

const HorizontalCollapse: React.FC<
    IHorizontalCollapseProps & React.HTMLAttributes<HTMLDivElement>
> = ({
    height,
    minHeight,
    tabHeight,
    tabDirection = 'top',
    collapsed,
    onTabClick,
    tabContent,
    children,
    className,
    ...rest
}) => {
    const collapseClass = classNames({
        content: true,
        collapsed,
    });

    const containerClass = classNames({
        [className as string]: true,
        'horizontal-collapse-container': true,
        'tab-reverse': tabDirection === 'bottom',
    });

    height = collapsed ? (tabHeight ? tabHeight : minHeight) : height;

    return (
        <div
            {...rest}
            className={containerClass}
            style={{ minHeight, height }}
            onTransitionEnd={() => {}}
        >
            <div
                style={{ height: tabHeight }}
                className="horizontal-tab"
                onClick={onTabClick}
            >
                <span className="tab-text">{tabContent}</span>
            </div>
            <div className={collapseClass}>{children}</div>
        </div>
    );
};

export default HorizontalCollapse;
