import classNames from 'classnames';
import React, { useState } from 'react';

import './VerticalCollapsible.less';

type TTabDirection = 'left' | 'right';

interface IVerticalCollapsibleProps {
    width?: string | number;
    minWidth?: string | number;
    tabWidth?: string | number;
    tabDirection?: TTabDirection;
    collapsed: boolean;
    onTabClick: () => void;
    tabContent: React.ReactNode;
    children: React.ReactNode;
}

export const VerticalCollapsible: React.FC<IVerticalCollapsibleProps> = ({
    width = '15%',
    minWidth = '18em',
    tabWidth = '30px',
    tabDirection = 'right',
    collapsed,
    tabContent,
    onTabClick,
    children,
}: IVerticalCollapsibleProps) => {
    const collapseClass = classNames({
        content: true,
        collapsed,
    });

    const containerClass = classNames({
        'vertical-collapse-container': true,
        'tab-reverse': tabDirection === 'left',
    });

    minWidth = collapsed ? 0 : minWidth;
    width = collapsed ? tabWidth : width;

    return (
        <div className={containerClass} style={{ minWidth, width }}>
            <div className={collapseClass}>{children}</div>
            <div
                style={{ width: tabWidth }}
                className="tab"
                onClick={onTabClick}
            >
                <span className="tab-text">{tabContent}</span>
            </div>
        </div>
    );
};
