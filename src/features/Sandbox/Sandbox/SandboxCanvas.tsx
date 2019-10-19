import { Badge, Button, Icon, Input, Spin } from 'antd';
import classNames from 'classnames';
import { Loader } from 'components';
import { useStore } from 'overstated';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Link } from '../Link/Link';
import LinkController from '../Link/link-controller';
import { Node } from '../Node';
import { CanvasStore } from '../stores';
import './SandboxCanvas.less';

export const sandboxDroppableId = 'sandboxId';

const SandboxDropContainer = React.memo(() => (
    <Droppable droppableId={sandboxDroppableId}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                className="droppable-area"
                {...provided.droppableProps}
                style={{ width: '100%', height: '100%' }}
            >
                {provided.placeholder}
            </div>
        )}
    </Droppable>
));

export interface ISandboxProps {
    canvasStore: CanvasStore;
    size?: Dimensions;
}

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    canvasStore,
    size = { width: 12000, height: 12000 },
}: ISandboxProps) => {
    const {
        isLoading,
        links,
        nodes,
        isDisabled,
        toggleConsole,
        canToggleConsole,
        linksVisible,
        hasUnread,
        isConsoleLoading,
        resetView,
        editNode,
        removeNode,
        onNodePositionUpdate,
        onPortAdd,
        onPortRemove,
        onPortEvent,
        isDrawingLink,
        onNodeDrag,
    } = useStore(canvasStore, store => ({
        toggleConsole: store.ctx.logsStore.toggleOpen,
        isDisabled: store.isDisabled,
        canToggleConsole: store.ctx.logsStore.canToggle,
        hasUnread: store.ctx.logsStore.state.hasUnread,
        isConsoleLoading: store.ctx.logsStore.state.isLoading,
        resetView: store.resetView,
        editNode: store.editNode,
        removeNode: store.removeNode,
        onNodePositionUpdate: store.onNodePositionUpdate,
        onPortAdd: store.onPortAdd,
        onPortRemove: store.onPortRemove,
        onPortEvent: store.onPortEvent,
        onNodeDrag: store.onNodeMove,
        ...store.state,
    }));

    const canvasRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const canvasElement = canvasRef.current!;
        canvasStore.bindElement(canvasElement, size);
    }, []);

    // This may or may not be necessary
    const nodePositionUpdate = useCallback(
        (position: Vector2) => onNodePositionUpdate(position),
        []
    );

    const portRemove = useCallback(
        (data: PortDataSlim) => onPortRemove(data),
        []
    );

    const portAdd = useCallback((data: PortDataSlim) => onPortAdd(data), []);

    const portEvent = useCallback(
        (type: PortEvent, element: HTMLElement, data: PortDataSlim) =>
            onPortEvent(type, element, data),
        []
    );

    const nodeDrag = useCallback((id: string) => onNodeDrag(id), []);

    return (
        <div
            className={classNames({
                sandbox: true,
                disabled: isDisabled,
            })}
        >
            {isLoading && <Loader size={9} />}
            <SandboxDropContainer />
            <div
                className={classNames({ canvas: true, isLoading })}
                ref={canvasRef}
            >
                <div className="links" style={{ position: 'absolute' }}>
                    {links.map(l => (
                        <Link
                            key={l.id}
                            type={l.type}
                            visible={linksVisible}
                            getRef={l.getElementRef}
                        />
                    ))}
                    {/* <Link
                        visible={!!isDrawing}
                        type={linkType!}
                        getRef={getDrawLinkRef}
                    /> */}
                </div>
                <div className="nodes">
                    {nodes.map(n => (
                        <Node
                            key={n.id}
                            initialPosition={n.position}
                            flowInputs={n.portData.flowInputs}
                            flowOutputs={n.portData.flowOutputs}
                            valueInputs={n.portData.valueInputs}
                            valueOutputs={n.portData.valueOutputs}
                            hidePortActions={isDrawingLink}
                            onPortAdd={portAdd}
                            onPortEvent={portEvent}
                            onPortRemove={portRemove}
                            onDragStop={nodePositionUpdate}
                            onDrag={nodeDrag}
                            {...n}
                        />
                    ))}
                </div>
            </div>
            <div className="footer bottom-left-footer">
                <Input
                    prefix={<Icon type="search" />}
                    onChange={event => {}}
                    allowClear
                    placeholder="Search Nodes"
                />
                <Badge count={hasUnread ? 1 : 0} dot>
                    <Button
                        disabled={canToggleConsole}
                        shape="circle"
                        type="primary"
                        icon="code"
                        loading={isConsoleLoading}
                        onClick={() => toggleConsole()}
                    />
                </Badge>
            </div>
            <div className="footer bottom-right-footer">
                <Button
                    type="primary"
                    shape="circle"
                    icon="minus"
                    // onClick={() => sandboxManager.magnify(-0.15)}
                />
                <Button
                    type="primary"
                    shape="circle"
                    icon="block"
                    onClick={resetView}
                />
                <Button
                    type="primary"
                    shape="circle"
                    icon="plus"
                    // onClick={() => sandboxManager.magnify(0.15)}
                />
            </div>
        </div>
    );
};
