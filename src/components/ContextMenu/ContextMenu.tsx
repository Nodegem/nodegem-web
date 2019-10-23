import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';

import { Menu } from 'antd';
import './ContextMenu.less';

interface IContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    trigger: string;
    delayClose?: number;
}

export const ContextMenu: React.FC<IContextMenuProps> = ({
    trigger,
    className,
    children,
    delayClose = 250,
    ...rest
}) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    let timeoutId: NodeJS.Timeout;

    useEffect(() => {
        const rightClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target && target.hasAttribute(trigger)) {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                event.preventDefault();
                setVisible(!visible);
                setPosition({
                    x: event.clientX,
                    y: event.clientY,
                });
            }
        };

        const onMouseDown = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target && !target.hasAttribute(trigger) && visible) {
                event.preventDefault();
                setVisible(false);
            }
        };

        window.addEventListener('contextmenu', rightClick);
        window.addEventListener('mousedown', onMouseDown);

        return () => {
            window.removeEventListener('contextmenu', rightClick);
            window.removeEventListener('mousedown', onMouseDown);
        };
    }, [visible]);

    const onMouseEnter = () => {
        if (visible) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        }
    };

    const onMouseLeave = () => {
        if (visible) {
            timeoutId = setTimeout(() => {
                setVisible(false);
            }, delayClose);
        }
    };

    const classes = classNames({
        'context-menu': true,
        'context-menu--visible': visible,
        'context-menu--hidden': !visible,
    });

    const { x, y } = position;

    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={classes}
            style={{
                position: 'fixed',
                left: x,
                top: y,
            }}
            {...rest}
        >
            <Menu>{children}</Menu>
        </div>
    );
};
