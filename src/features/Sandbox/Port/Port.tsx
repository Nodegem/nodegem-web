import React, { useEffect, useRef } from 'react';

import { Button, Icon, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import classNames from 'classnames';
import { convertPortName } from '../utils';
import './Port.less';

interface ISocketProps {
    data: IPortUIData;
    sandboxMode?: boolean;
    lastPort: boolean;
    getPortRef?: (port: IPortUIData, element: HTMLElement) => void;
    removePortRef?: (id: string) => void;
    onPortEvent?: (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData
    ) => void;
    onAddPort?: (port: IPortUIData) => void;
    onRemovePort?: (port: IPortUIData) => void;
    hidePortActions?: boolean;
}

export const Socket: React.FC<ISocketProps> = ({
    onPortEvent,
    data,
    getPortRef,
    removePortRef,
    sandboxMode,
    onAddPort,
    lastPort,
    onRemovePort,
    hidePortActions = false,
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
        if (!sandboxMode) {
            return;
        }

        getPortRef!(data, portRef.current!);
        portRef.current!.addEventListener('mousedown', portClick);
        portRef.current!.addEventListener('mouseup', portClick);
        portRef.current!.addEventListener('touchstart', portClick);
        portRef.current!.addEventListener('touchend', portClick);
        return () => {
            if (!sandboxMode) {
                return;
            }
            removePortRef!(data.id);
            portRef.current!.removeEventListener('mousedown', portClick);
            portRef.current!.removeEventListener('mouseup', portClick);
            portRef.current!.removeEventListener('touchstart', portClick);
            portRef.current!.removeEventListener('touchend', portClick);
        };
    }, [portRef]);

    const placement: TooltipPlacement =
        data.io === 'output' && data.type === 'flow'
            ? 'bottom'
            : data.io === 'input' && data.type === 'value'
            ? 'left'
            : data.io === 'output' && data.type === 'value'
            ? 'right'
            : 'top';

    return (
        <div
            className={classNames({
                'port-container': true,
                indefinite: data.indefinite,
                [placement]: data.indefinite,
            })}
            style={{
                display: 'flex',
                flexDirection: placement === 'right' ? 'row-reverse' : 'row',
            }}
        >
            {!hidePortActions &&
                data.indefinite &&
                (lastPort ? (
                    <Tooltip title={`Add to ${data.name}`}>
                        <span
                            onClick={() => onAddPort && onAddPort(data)}
                            className="port-action add-port"
                        >
                            <Icon type="plus-circle" />
                        </span>
                    </Tooltip>
                ) : (
                    <span
                        onClick={() => onRemovePort && onRemovePort(data)}
                        className="port-action remove-port"
                    >
                        <Icon type="minus-circle" />
                    </span>
                ))}
            <Tooltip title={convertPortName(data)} placement={placement}>
                <span
                    ref={portRef}
                    className={classNames({
                        port: true,
                        'sandbox-mode': sandboxMode,
                        connecting: data.connecting,
                        connected: data.connected,
                    })}
                />
            </Tooltip>
        </div>
    );
};
