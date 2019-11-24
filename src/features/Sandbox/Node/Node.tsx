import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Socket as Port } from '../Port/Port';
import './Node.less';

interface INodeProps {
    isMacro?: boolean;
    nodeId: string;
    scale: number;
    selected: boolean;
    title: string;
    isFaded?: boolean;
    initialPosition: Vector2;
    flowInputs: IPortUIData[];
    flowOutputs: IPortUIData[];
    valueInputs: IPortUIData[];
    valueOutputs: IPortUIData[];
    hidePortActions: boolean;
    onDblClick: (event: MouseEvent, nodeId: string) => void;
    onClick: (event: MouseEvent, nodeId: string) => void;
    onRightClick: (event: MouseEvent, nodeId: string) => void;
    onDrag: (id: string) => void;
    onDragStop: (id: string, position: Vector2) => void;
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
        isFaded,
        scale,
        selected,
        title,
        initialPosition,
        flowInputs,
        flowOutputs,
        valueInputs,
        valueOutputs,
        hidePortActions,
        onClick,
        onDblClick,
        onRightClick,
        onPortEvent,
        onPortAdd,
        onPortRemove,
        onDrag,
        onDragStop,
    }: INodeProps) => {
        const [position, setPosition] = useState(initialPosition);

        const handleDrag = useCallback(
            (e: DraggableEvent, data: DraggableData) => {
                onDrag(nodeId);
            },
            [onDrag, nodeId]
        );

        const handleDragStop = useCallback(
            (e: DraggableEvent, data: DraggableData) => {
                setPosition(data);
                onDragStop(nodeId, { x: data.x, y: data.y });
            },
            [nodeId, onDragStop]
        );

        const handleDblClick = useCallback(
            (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                onDblClick(event.nativeEvent, nodeId);
            },
            [nodeId, onDblClick]
        );

        const handleClick = useCallback(
            (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                onClick(event.nativeEvent, nodeId);
            },
            [nodeId, onClick]
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
            <Draggable
                position={position}
                onDrag={handleDrag}
                onStop={handleDragStop}
                scale={scale}
            >
                <div
                    data-node
                    id={nodeId}
                    style={{ position: 'absolute' }}
                    className={classes}
                    onDoubleClick={handleDblClick}
                    onContextMenu={handleRightClick}
                    onClick={handleClick}
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
            </Draggable>
        );
    }
);
