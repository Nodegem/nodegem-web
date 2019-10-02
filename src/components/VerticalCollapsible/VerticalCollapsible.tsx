import classNames from 'classnames';
import React, { useState } from 'react';

import './VerticalCollapsible.less';

type TTabDirection = 'left' | 'right';

interface IVerticalCollapsibleProps {
    width?: string | number;
    minWidth?: string | number;
    contentMinWidth?: string | number;
    tabWidth?: string | number;
    tabDirection?: TTabDirection;
    collapsed: boolean;
    onTabClick: () => void;
    tabContent: React.ReactNode;
    children: React.ReactNode;
}

export const VerticalCollapsible: React.FC<IVerticalCollapsibleProps> = ({
    width = '15%',
    minWidth = 0,
    tabWidth = '25px',
    contentMinWidth,
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

    width = collapsed ? tabWidth : width;

    return (
        <div className={containerClass} style={{ minWidth, width }}>
            <div className={collapseClass}>{children}</div>
            <div
                style={{ width: tabWidth }}
                className="vertical-tab"
                onClick={onTabClick}
            >
                <span
                    className="tab-text"
                    style={{ minWidth: contentMinWidth }}
                >
                    {tabContent}
                </span>
            </div>
        </div>
    );
};
