import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, Tooltip } from 'antd';
import classNames from 'classnames';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Socket as Port } from '../Port/Port';
import './Node.less';

const ToolbarContents: React.FC<Omit<IToolbarProps, 'visible'>> = React.memo(
    ({ id, edit, remove, permanent }) => {
        return (
            <span className="toolbar">
                <Button onClick={() => edit(id)} type="primary" icon="edit" />
                <Button
                    onClick={() => remove(id)}
                    type="danger"
                    icon="delete"
                    disabled={permanent}
                />
            </span>
        );
    }
);

interface IToolbarProps {
    visible: boolean;
    id: string;
    permanent?: boolean;
    edit: (id: string) => void;
    remove: (id: string) => void;
}

const Toolbar: React.FC<IToolbarProps> = React.memo(
    ({ remove, edit, permanent, id, visible, children }) => {
        return (
            <Tooltip
                visible={visible}
                title={
                    <ToolbarContents
                        edit={edit}
                        remove={remove}
                        id={id}
                        permanent={permanent}
                    />
                }
            >
                {children}
            </Tooltip>
        );
    }
);

interface INodeProps {
    id: string;
    scale: number;
    selected: boolean;
    title: string;
    permanent?: boolean;
    initialPosition: Vector2;
    flowInputs: IPortUIData[];
    flowOutputs: IPortUIData[];
    valueInputs: IPortUIData[];
    valueOutputs: IPortUIData[];
    hidePortActions: boolean;
    onDblClick: (event: MouseEvent, nodeId: string) => void;
    onClick: (event: MouseEvent, nodeId: string) => void;
    editNode: (nodeId: string) => void;
    removeNode: (nodeId: string) => void;
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
    id,
    scale,
    permanent,
    selected,
    title,
    initialPosition,
    flowInputs,
    flowOutputs,
    valueInputs,
    valueOutputs,
    hidePortActions,
    onClick,
    editNode,
    removeNode,
    onDblClick,
    onPortEvent,
    onPortAdd,
    onPortRemove,
    onDrag,
    onDragStop,
}: INodeProps) => {
    const [position, setPosition] = useState(initialPosition);

    const handleDrag = useCallback(
        (e: DraggableEvent, data: DraggableData) => {
            onDrag(id);
        },
        [onDrag, id]
    );

    const handleDragStop = useCallback(
        (e: DraggableEvent, data: DraggableData) => {
            setPosition(data);
            onDragStop(id, { x: data.x, y: data.y });
        },
        [id, onDragStop]
    );

    const handleDblClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            onDblClick(event.nativeEvent, id);
        },
        [id, onDblClick]
    );

    const handleClick = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            onClick(event.nativeEvent, id);
        },
        [id, onClick]
    );

    const classes = classNames({
        'node-container': true,
        selected,
    });

    return (
        <Toolbar
            id={id}
            edit={editNode}
            remove={removeNode}
            permanent={permanent}
            visible={selected}
        >
            <Draggable
                position={position}
                onDrag={handleDrag}
                onStop={handleDragStop}
                scale={scale}
            >
                <div
                    id={id}
                    style={{ position: 'absolute' }}
                    className={classes}
                    onDoubleClick={handleDblClick}
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
                                nodeId={id}
                                {...fi}
                            />
                        ))}
                    </div>
                    <div className="inner">
                        <div className="value value-inputs">
                            {valueInputs.map((vi, i) => (
                                <Port
                                    key={vi.id}
                                    onPortEvent={onPortEvent}
                                    onAddPort={onPortAdd}
                                    onRemovePort={onPortRemove}
                                    lastPort={i === valueInputs.length - 1}
                                    hidePortActions={hidePortActions}
                                    nodeId={id}
                                    {...vi}
                                />
                            ))}
                        </div>
                        <span className="title">{title}</span>
                        <div className="value value-outputs">
                            {valueOutputs.map((vo, i) => (
                                <Port
                                    key={vo.id}
                                    onPortEvent={onPortEvent}
                                    onAddPort={onPortAdd}
                                    onRemovePort={onPortRemove}
                                    lastPort={i === valueInputs.length - 1}
                                    hidePortActions={hidePortActions}
                                    nodeId={id}
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
                                nodeId={id}
                                {...fo}
                            />
                        ))}
                    </div>
                </div>
            </Draggable>
        </Toolbar>
    );
};
