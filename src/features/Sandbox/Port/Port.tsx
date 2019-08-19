import React, { useEffect, useRef } from 'react';

import './Port.less';

interface ISocketProps {
    data: IPortData;
    onPortDown?: (event: MouseEvent, data: IPortData) => void;
}

export const Socket: React.FC<ISocketProps> = ({
    onPortDown,
    data,
}: ISocketProps) => {
    const portRef = useRef<HTMLSpanElement>(null);
    const portClick = (event: MouseEvent) => {
        if (onPortDown) {
            onPortDown(event, data);
        }
    };

    useEffect(() => {
        portRef.current!.addEventListener('mousedown', portClick);
        return () => {
            portRef.current!.removeEventListener('mousedown', portClick);
        };
    });

    return <span ref={portRef} className="port" />;
};
