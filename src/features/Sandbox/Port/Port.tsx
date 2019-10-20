import React, { useCallback, useMemo, useRef } from 'react';

import { Icon, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import classNames from 'classnames';
import _ from 'lodash';
import './Port.less';

const getPlacement = (io: PortIOType, type: PortType): TooltipPlacement => {
    return io === 'output' && type === 'flow'
        ? 'bottom'
        : io === 'input' && type === 'value'
        ? 'left'
        : io === 'output' && type === 'value'
        ? 'right'
        : 'top';
};

interface ISocketProps {
    name: string;
    id: string;
    nodeId: string;
    io: PortIOType;
    type: PortType;
    indefinite?: boolean;
    connected?: boolean;
    connecting?: boolean;
    lastPort: boolean;
    onPortEvent: (
        event: PortEvent,
        element: HTMLElement,
        data: PortDataSlim,
        nodeId: string
    ) => void;
    onAddPort?: (data: PortDataSlim) => void;
    onRemovePort?: (data: PortDataSlim) => void;
    hidePortActions?: boolean;
}

const propEqual = (prev: ISocketProps, cur: ISocketProps) => {
    if (prev.nodeId !== cur.nodeId && prev.id !== cur.id) {
        return false;
    }

    // If you aren't indefinite but wanna hide port actions just pretend you are the same
    if (cur.hidePortActions && !cur.indefinite) {
        return true;
    }

    return prev === cur;
};

export const Socket: React.FC<ISocketProps> = React.memo(
    ({
        onPortEvent,
        id,
        nodeId,
        io,
        type,
        onAddPort,
        lastPort,
        onRemovePort,
        indefinite = false,
        connected = false,
        connecting = false,
        hidePortActions = false,
    }: ISocketProps) => {
        const data = { id, nodeId, io, type, connected, connecting, name };

        const portUp = useCallback(
            (
                event:
                    | React.MouseEvent<HTMLSpanElement, MouseEvent>
                    | React.TouchEvent<HTMLSpanElement>
            ) => {
                event.stopPropagation();
                event.preventDefault();
                onPortEvent('up', event.target as HTMLElement, data, nodeId);
            },
            [onPortEvent, id, nodeId, io, type]
        );

        const portDown = useCallback(
            (
                event:
                    | React.MouseEvent<HTMLSpanElement, MouseEvent>
                    | React.TouchEvent<HTMLSpanElement>
            ) => {
                event.stopPropagation();
                event.preventDefault();
                onPortEvent('down', event.target as HTMLElement, data, nodeId);
            },
            [onPortEvent, id, nodeId, io, type]
        );

        const placement = useMemo(() => getPlacement(io, type), [io, type]);

        return (
            <div
                className={classNames({
                    'port-container': true,
                    indefinite,
                    [placement]: indefinite,
                })}
                style={{
                    display: 'flex',
                    flexDirection:
                        placement === 'right' ? 'row-reverse' : 'row',
                }}
            >
                {indefinite &&
                    (lastPort ? (
                        <Tooltip title={`Add to ${name}`}>
                            <span
                                onClick={() => onAddPort && onAddPort(data)}
                                className={classNames({
                                    'port-action': true,
                                    'add-port': true,
                                    hidden: hidePortActions,
                                })}
                            >
                                <Icon type="plus-circle" />
                            </span>
                        </Tooltip>
                    ) : (
                        !connected && (
                            <span
                                onClick={() =>
                                    onRemovePort && onRemovePort(data)
                                }
                                className={classNames({
                                    'port-action': true,
                                    'remove-port': true,
                                    hidden: hidePortActions,
                                })}
                            >
                                <Icon type="minus-circle" />
                            </span>
                        )
                    ))}
                <Tooltip title={name} placement={placement}>
                    <span
                        id={`${nodeId}-${id}`}
                        onMouseDown={portDown}
                        onTouchStart={portDown}
                        onMouseUp={portUp}
                        onTouchEnd={portUp}
                        className={classNames({
                            port: true,
                            connecting,
                            connected,
                        })}
                    />
                </Tooltip>
            </div>
        );
    },
    propEqual
);
