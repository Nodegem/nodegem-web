import classNames from 'classnames';
import React from 'react';

import './VerticalCollapsible.less';

type TTabDirection = 'left' | 'right';

interface IVerticalCollapsibleProps {
    width?: string | number;
    tabWidth?: string | number;
    tabDirection?: TTabDirection;
    collapsed: boolean;
    onTabClick: () => void;
    tabContent: React.ReactNode;
    children: React.ReactNode;
}

export const VerticalCollapsible: React.FC<IVerticalCollapsibleProps> = ({
    width = '20%',
    tabWidth = '40px',
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

    return (
        <div className={containerClass} style={{ width }}>
            <div className={collapseClass}>{children}</div>
            <div
                style={{ width: tabWidth }}
                className="tab"
                onClick={onTabClick}
            >
                {tabContent}
            </div>
        </div>
    );
};
