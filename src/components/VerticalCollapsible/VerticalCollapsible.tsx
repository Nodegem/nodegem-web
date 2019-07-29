import classNames from 'classnames';
import React, { useState } from 'react';

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
    width = '15%',
    tabWidth = '30px',
    tabDirection = 'right',
    collapsed,
    tabContent,
    onTabClick,
    children,
}: IVerticalCollapsibleProps) => {
    const [containerWidth, setContainerWidth] = useState(width);

    const collapseClass = classNames({
        content: true,
        collapsed,
    });

    const containerClass = classNames({
        'vertical-collapse-container': true,
        'tab-reverse': tabDirection === 'left',
    });

    function onCollapseEnd() {
        if (collapsed) {
            setContainerWidth('auto');
        } else {
            setContainerWidth(width);
        }
    }

    return (
        <div className={containerClass} style={{ width: containerWidth }}>
            <div className={collapseClass} onTransitionEnd={onCollapseEnd}>
                {children}
            </div>
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
