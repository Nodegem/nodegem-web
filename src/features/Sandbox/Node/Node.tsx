import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { Button, Tooltip } from 'antd';
import Draggable, {
    DraggableData,
    DraggableEvent,
    DraggableEventHandler,
} from 'react-draggable';
import { Socket as Port } from '../Port/Port';
import './Node.less';

const ToolbarContents: React.FC<IToolbarProps> = React.memo(
    ({ nodeData, edit, remove, forceClose }) => {
        return (
            <span className="toolbar">
                <Button
                    onClick={() => {
                        edit(nodeData);
                        forceClose();
                    }}
                    type="primary"
                    icon="edit"
                />
                {!nodeData.permanent && (
                    <Button
                        onClick={() => remove(nodeData.id)}
                        type="danger"
                        icon="delete"
                    />
                )}
            </span>
        );
    }
);

interface IToolbarProps {
    visible?: boolean;
    nodeData: INodeUIData;
    edit: (data: INodeUIData) => void;
    remove: (id: string) => void;
    forceClose: () => void;
}

const Toolbar: React.FC<IToolbarProps> = React.memo(
    ({ visible, remove, edit, forceClose, nodeData, children }) => {
        return (
            <Tooltip
                visible={visible}
                className="toolbar-tooltip"
                title={
                    <ToolbarContents
                        edit={edit}
                        remove={remove}
                        nodeData={nodeData}
                        forceClose={forceClose}
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
    initialPosition: Vector2;
    flowInputs: IPortUIData[];
    flowOutputs: IPortUIData[];
    valueInputs: IPortUIData[];
    valueOutputs: IPortUIData[];
    hidePortActions: boolean;
    onDrag: (id: string) => void;
    onDragStop: (position: Vector2) => void;
    onPortEvent: (
        event: PortEvent,
        element: HTMLElement,
        data: PortDataSlim
    ) => void;
    onPortAdd: (port: PortDataSlim) => void;
    onPortRemove: (port: PortDataSlim) => void;
}

export const Node: React.FC<INodeProps> = ({
    id,
    selected,
    title,
    initialPosition,
    flowInputs,
    flowOutputs,
    valueInputs,
    valueOutputs,
    hidePortActions,
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

    return (
        // <Toolbar
        //     // edit={editNode}
        //     // remove={removeNode}
        //     // nodeData={data}
        // >
        <Draggable
            position={position}
            onDrag={handleDrag}
            onStop={handleDragStop}
        >
            {useMemo(
                () => (
                    <div
                        style={{ position: 'absolute' }}
                        className="node-container"
                    >
                        <div className="flow flow-inputs">
                            {/* {flowInputs.map((fi, i) => (
                        <Port
                            getPortRef={getPortRef}
                            removePortRef={removePortRef}
                            key={fi.id}
                            data={fi}
                            onPortEvent={onPortEvent}
                            onAddPort={onPortAdd}
                            lastPort={i === flowInputs.length - 1}
                            hidePortActions={hidePortActions}
                        />
                    ))} */}
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
                                {/* {valueOutputs.map((vo, i) => (
                            <Port
                                getPortRef={getPortRef}
                                removePortRef={removePortRef}
                                key={vo.id}
                                data={vo}
                                onPortEvent={onPortEvent}
                                lastPort={i === valueOutputs.length - 1}
                                onAddPort={onPortAdd}
                                hidePortActions={hidePortActions}
                            />
                        ))} */}
                            </div>
                        </div>
                        <div className="flow flow-outputs">
                            {/* {flowOutputs.map((fo, i) => (
                        <Port
                            getPortRef={getPortRef}
                            removePortRef={removePortRef}
                            key={fo.id}
                            data={fo}
                            onPortEvent={onPortEvent}
                            onAddPort={onPortAdd}
                            lastPort={i === flowOutputs.length - 1}
                            hidePortActions={hidePortActions}
                        />
                    ))} */}
                        </div>
                    </div>
                ),
                [title, flowInputs, flowOutputs, valueInputs, valueOutputs]
            )}
        </Draggable>
        // </Toolbar>
    );
};
