import React, { useEffect, useRef } from 'react';

import classNames from 'classnames';
import './Port.less';

interface ISocketProps {
    data: IPortUIData;
    onPortEvent?: (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData
    ) => void;
}

export const Socket: React.FC<ISocketProps> = ({
    onPortEvent,
    data,
}: ISocketProps) => {
    const portRef = useRef<HTMLSpanElement>(null);
    const portClick = (event: MouseEvent | TouchEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (onPortEvent) {
            const type =
                event.type === 'mouseup' || event.type === 'touchstart'
                    ? 'up'
                    : 'down';
            onPortEvent(type, event.target as HTMLElement, data);
        }
    };

    useEffect(() => {
        portRef.current!.addEventListener('mousedown', portClick);
        portRef.current!.addEventListener('mouseup', portClick);
        portRef.current!.addEventListener('touchstart', portClick);
        portRef.current!.addEventListener('touchend', portClick);
        return () => {
            portRef.current!.removeEventListener('mousedown', portClick);
            portRef.current!.removeEventListener('mouseup', portClick);
            portRef.current!.removeEventListener('touchstart', portClick);
            portRef.current!.removeEventListener('touchend', portClick);
        };
    }, [portRef]);

    return (
        <span
            ref={portRef}
            className={classNames({ port: true, connected: data.connected })}
        />
    );
};
