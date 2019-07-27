import classNames from 'classnames';
import React from 'react';

import './VerticalCollapsible.less';

interface IVerticalCollapsibleProps {
    collapsed: boolean;
    tabContent: React.ReactNode;
    children: React.ReactNode;
}

export const VerticalCollapsible: React.FC<IVerticalCollapsibleProps> = ({
    collapsed,
    tabContent,
    children,
}: IVerticalCollapsibleProps) => {
    const collapseClass = classNames({
        content: true,
        collapsed,
    });

    return (
        <div className="vertical-collapse-container">
            <div className="tab">{tabContent}</div>
            <div className={collapseClass}>{children}</div>
        </div>
    );
};
