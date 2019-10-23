import React, { useCallback, useMemo, useRef } from 'react';

import { Icon, Tooltip } from 'antd';
import { TooltipPlacement } from 'antd/lib/tooltip';
import classNames from 'classnames';
import _ from 'lodash';
import { getPortId } from '../utils';
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
    portId: string;
    nodeId: string;
    io: PortIOType;
    type: PortType;
    indefinite: boolean;
    connected: boolean;
    lastPort: boolean;
    onPortEvent: (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData,
        nodeId: string
    ) => void;
    onAddPort: (data: IPortUIData) => void;
    onRemovePort: (data: IPortUIData) => void;
    hidePortActions?: boolean;
}

export const Socket: React.FC<ISocketProps> = ({
    onPortEvent,
    name,
    portId,
    nodeId,
    io,
    type,
    onAddPort,
    lastPort,
    onRemovePort,
    indefinite = false,
    connected = false,
    hidePortActions = false,
}: ISocketProps) => {
    const data = { id: portId, nodeId, io, type, connected, name, indefinite };

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
        [onPortEvent, portId, nodeId, io, type, connected]
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
        [onPortEvent, portId, nodeId, io, type, connected]
    );

    const placement = useMemo(() => getPlacement(io, type), [io, type]);
    const portNodeId = useMemo(() => getPortId({ nodeId, id: portId }), [
        nodeId,
        portId,
    ]);

    return (
        <div
            className={classNames({
                'port-container': true,
                indefinite,
                [placement]: indefinite,
            })}
            style={{
                display: 'flex',
                flexDirection: placement === 'right' ? 'row-reverse' : 'row',
            }}
        >
            {indefinite &&
                (lastPort ? (
                    <Tooltip title={`Add to ${name}`}>
                        <span
                            onClick={() => onAddPort(data)}
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
                            onClick={() => onRemovePort(data)}
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
                    id={portNodeId}
                    onMouseDown={portDown}
                    onMouseUp={portUp}
                    className={classNames({
                        port: true,
                        connected,
                    })}
                />
            </Tooltip>
        </div>
    );
};
