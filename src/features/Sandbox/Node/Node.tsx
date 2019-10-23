import React, { useCallback, useState } from 'react';

import classNames from 'classnames';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Socket as Port } from '../Port/Port';
import './Node.less';

interface INodeProps {
    nodeId: string;
    scale: number;
    selected: boolean;
    title: string;
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

export const Node: React.FC<INodeProps> = ({
    nodeId,
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
        selected,
    });

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
                            lastPort={i === valueInputs.length - 1}
                            hidePortActions={hidePortActions}
                            nodeId={nodeId}
                            portId={fi.id}
                            {...fi}
                        />
                    ))}
                </div>
                <div data-node className="inner">
                    <div className="value value-inputs">
                        {valueInputs.map((vi, i) => (
                            <Port
                                key={vi.id}
                                onPortEvent={onPortEvent}
                                onAddPort={onPortAdd}
                                onRemovePort={onPortRemove}
                                lastPort={i === valueInputs.length - 1}
                                hidePortActions={hidePortActions}
                                nodeId={nodeId}
                                portId={vi.id}
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
                                lastPort={i === valueInputs.length - 1}
                                hidePortActions={hidePortActions}
                                nodeId={nodeId}
                                portId={vo.id}
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
                            lastPort={i === valueInputs.length - 1}
                            hidePortActions={hidePortActions}
                            nodeId={nodeId}
                            portId={fo.id}
                            {...fo}
                        />
                    ))}
                </div>
            </div>
        </Draggable>
    );
};
