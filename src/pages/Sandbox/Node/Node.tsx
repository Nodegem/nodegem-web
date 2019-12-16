import React, { useCallback } from 'react';

import classNames from 'classnames';
import { Socket as Port } from '../Port/Port';
import './Node.less';
import { Tooltip } from 'antd';

interface INodeProps {
    isMacro?: boolean;
    nodeId: string;
    fullName: string;
    selected: boolean;
    title: string;
    isFaded?: boolean;
    flowInputs: IPortUIData[];
    flowOutputs: IPortUIData[];
    valueInputs: IPortUIData[];
    valueOutputs: IPortUIData[];
    hidePortActions: boolean;
    onDblClick: (event: MouseEvent, nodeId: string) => void;
    onMouseDown: (event: MouseEvent, nodeId: string) => void;
    onMouseUp: (event: MouseEvent, nodeId: string) => void;
    onRightClick: (event: MouseEvent, nodeId: string) => void;
    onPortEvent: (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData,
        nodeId: string
    ) => void;
    onPortAdd: (port: IPortUIData) => void;
    onPortRemove: (port: IPortUIData) => void;
}

export const Node: React.FC<INodeProps> = React.memo(
    ({
        isMacro,
        nodeId,
        fullName,
        isFaded,
        selected,
        title,
        flowInputs,
        flowOutputs,
        valueInputs,
        valueOutputs,
        hidePortActions,
        onMouseDown,
        onMouseUp,
        onDblClick,
        onRightClick,
        onPortEvent,
        onPortAdd,
        onPortRemove,
    }: INodeProps) => {
        const handleDblClick = useCallback(
            (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                onDblClick(event.nativeEvent, nodeId);
            },
            [nodeId, onDblClick]
        );

        const handleMouseDown = useCallback(
            (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                onMouseDown(event.nativeEvent, nodeId);
            },
            [nodeId, onMouseDown]
        );

        const handleMouseUp = useCallback(
            (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                onMouseUp(event.nativeEvent, nodeId);
            },
            [nodeId, onMouseUp]
        );

        const handleRightClick = useCallback(
            (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                onRightClick(event.nativeEvent, nodeId);
            },
            [nodeId, onRightClick]
        );

        const classes = classNames({
            'node-container': true,
            macro: isMacro,
            faded: isFaded,
            selected,
        });

        const shouldShowAdd = (
            port: IPortUIData,
            index: number,
            ports: IPortUIData[]
        ) => {
            if (port.indefinite) {
                const startIndex = ports.findIndex(
                    x => x.indefinite && x.name === port.name
                );
                const indefinitePorts = ports.filter(
                    x => x.indefinite && x.name === port.name
                );
                return index === startIndex + indefinitePorts.length - 1;
            }

            return false;
        };

        return (
            <Tooltip title={fullName} mouseEnterDelay={0.75}>
                <div
                    data-node
                    id={nodeId}
                    style={{ position: 'absolute' }}
                    className={classes}
                    onDoubleClick={handleDblClick}
                    onContextMenu={handleRightClick}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                >
                    <div className="flow flow-inputs">
                        {flowInputs.map((fi, i) => (
                            <Port
                                key={fi.id}
                                onPortEvent={onPortEvent}
                                onAddPort={onPortAdd}
                                onRemovePort={onPortRemove}
                                showAdd={shouldShowAdd(fi, i, flowInputs)}
                                hidePortActions={hidePortActions}
                                nodeId={nodeId}
                                portId={fi.id}
                                isRemovable={flowInputs.length > 1}
                                {...fi}
                            />
                        ))}
                    </div>
                    <div data-node className="inner">
                        <div className="value value-inputs">
                            {valueInputs
                                .filter(x => x.allowConnection)
                                .map((vi, i) => (
                                    <Port
                                        key={vi.id}
                                        onPortEvent={onPortEvent}
                                        onAddPort={onPortAdd}
                                        onRemovePort={onPortRemove}
                                        showAdd={shouldShowAdd(
                                            vi,
                                            i,
                                            valueInputs
                                        )}
                                        hidePortActions={hidePortActions}
                                        nodeId={nodeId}
                                        portId={vi.id}
                                        isRemovable={
                                            valueInputs.count(
                                                x => x.indefinite
                                            ) > 1
                                        }
                                        {...vi}
                                    />
                                ))}
                        </div>
                        <span data-node className="title">
                            {title}
                        </span>
                        <div className="value value-outputs">
                            {valueOutputs.map((vo, i) => (
                                <Port
                                    key={vo.id}
                                    onPortEvent={onPortEvent}
                                    onAddPort={onPortAdd}
                                    onRemovePort={onPortRemove}
                                    showAdd={shouldShowAdd(vo, i, valueOutputs)}
                                    hidePortActions={hidePortActions}
                                    nodeId={nodeId}
                                    portId={vo.id}
                                    isRemovable={
                                        valueOutputs.count(x => x.indefinite) >
                                        1
                                    }
                                    {...vo}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flow flow-outputs">
                        {flowOutputs.map((fo, i) => (
                            <Port
                                key={fo.id}
                                onPortEvent={onPortEvent}
                                onAddPort={onPortAdd}
                                onRemovePort={onPortRemove}
                                showAdd={shouldShowAdd(fo, i, flowOutputs)}
                                hidePortActions={hidePortActions}
                                nodeId={nodeId}
                                portId={fo.id}
                                isRemovable={
                                    flowOutputs.count(x => x.indefinite) > 1
                                }
                                {...fo}
                            />
                        ))}
                    </div>
                </div>
            </Tooltip>
        );
    }
);
