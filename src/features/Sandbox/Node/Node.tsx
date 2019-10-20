import React, { useCallback, useMemo, useState } from 'react';

import { Button, Tooltip } from 'antd';
import classNames from 'classnames';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Socket as Port } from '../Port/Port';
import './Node.less';

const ToolbarContents: React.FC<IToolbarProps> = React.memo(
    ({ id, edit, remove, permanent }) => {
        return (
            <span className="toolbar">
                <Button
                    onClick={() => {
                        edit(id);
                    }}
                    type="primary"
                    icon="edit"
                />
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
    id: string;
    permanent?: boolean;
    edit: (id: string) => void;
    remove: (id: string) => void;
}

const Toolbar: React.FC<IToolbarProps> = React.memo(
    ({ remove, edit, permanent, id, children }) => {
        return (
            <Tooltip
                className="toolbar-tooltip"
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
    selected: boolean;
    title: string;
    permanent?: boolean;
    initialPosition: Vector2;
    flowInputs: IPortUIData[];
    flowOutputs: IPortUIData[];
    valueInputs: IPortUIData[];
    valueOutputs: IPortUIData[];
    hidePortActions: boolean;
    editNode: (nodeId: string) => void;
    removeNode: (nodeId: string) => void;
    onDrag: (id: string) => void;
    onDragStop: (position: Vector2) => void;
    onPortEvent: (
        event: PortEvent,
        element: HTMLElement,
        data: PortDataSlim,
        nodeId: string
    ) => void;
    onPortAdd: (port: PortDataSlim) => void;
    onPortRemove: (port: PortDataSlim) => void;
}

export const Node: React.FC<INodeProps> = ({
    id,
    permanent,
    selected,
    title,
    initialPosition,
    flowInputs,
    flowOutputs,
    valueInputs,
    valueOutputs,
    hidePortActions,
    editNode,
    removeNode,
    onPortEvent,
    onPortAdd,
    onPortRemove,
    onDrag,
    onDragStop,
}: INodeProps) => {
    const [position, setPosition] = useState(initialPosition);

    const handleDrag = useCallback(
        (e: DraggableEvent, data: DraggableData) => {
            e.stopPropagation();
            onDrag(id);
        },
        [onDrag, id]
    );

    const handleDragStop = useCallback(
        (e: DraggableEvent, data: DraggableData) => {
            setPosition(data);
            onDragStop(data);
        },
        [onDragStop]
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
        >
            <div style={{ position: 'absolute' }} className={classes}>
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
    );
};
