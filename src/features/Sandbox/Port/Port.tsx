import React, { useCallback, useMemo } from 'react';

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
    isEditable?: boolean;
    connected: boolean;
    showAdd: boolean;
    isRemovable: boolean;
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

export const Socket: React.FC<ISocketProps> = React.memo(
    ({
        onPortEvent,
        name,
        portId,
        nodeId,
        isEditable,
        io,
        type,
        onAddPort,
        isRemovable,
        showAdd,
        onRemovePort,
        indefinite = false,
        connected = false,
        hidePortActions = false,
    }: ISocketProps) => {
        const data = {
            id: portId,
            nodeId,
            io,
            type,
            connected,
            name,
            indefinite,
            isEditable,
        };

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
                    flexDirection:
                        placement === 'right' ? 'row-reverse' : 'row',
                }}
            >
                {indefinite && (
                    <div className="port-actions">
                        {!connected && isRemovable && (
                            <span
                                onClick={() =>
                                    isRemovable && onRemovePort(data)
                                }
                                className={classNames({
                                    'port-action': true,
                                    'remove-port': true,
                                    disabled: !isRemovable,
                                    hidden: hidePortActions,
                                })}
                            >
                                <Tooltip title="Remove" placement={placement}>
                                    <Icon type="minus-circle" />
                                </Tooltip>
                            </span>
                        )}
                        {showAdd && (
                            <span
                                onClick={() => onAddPort(data)}
                                className={classNames({
                                    'port-action': true,
                                    'add-port': true,
                                    hidden: hidePortActions,
                                })}
                            >
                                <Tooltip
                                    title={`Add to ${name}`}
                                    placement={placement}
                                >
                                    <Icon type="plus-circle" />
                                </Tooltip>
                            </span>
                        )}
                    </div>
                )}
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
    }
);
