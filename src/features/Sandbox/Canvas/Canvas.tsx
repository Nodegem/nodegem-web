import { Badge, Button, Icon, Input } from 'antd';
import classNames from 'classnames';
import { Loader } from 'components';
import { useStore } from 'overstated';
import React, { useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Link } from '..';
import { Node } from '../Node';
import { CanvasStore } from '../stores';
import './Canvas.less';
import { DrawLink } from './DrawLink';

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
    isLoading: boolean;
    size?: Dimensions;
}

export const Canvas: React.FC<ISandboxProps> = ({
    isLoading,
    canvasStore,
    size = { width: 12000, height: 12000 },
}: ISandboxProps) => {
    const {
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
        drawLinkStore,
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
        drawLinkStore: store.drawLinkStore,
        isDrawingLink: store.drawLinkStore.state.isDrawing,
        ...store.state,
    }));

    const canvasRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const canvasElement = canvasRef.current!;
        canvasStore.bindElement(canvasElement, size);
    }, []);

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
                            linkId={l.id}
                            visible={linksVisible}
                            {...l}
                        />
                    ))}
                    <DrawLink drawLinkStore={drawLinkStore} />
                </div>
                <div className="nodes">
                    {nodes.map(n => (
                        <Node
                            key={n.id}
                            initialPosition={n.position}
                            flowInputs={n.flowInputs}
                            flowOutputs={n.flowOutputs}
                            valueInputs={n.valueInputs}
                            valueOutputs={n.valueOutputs}
                            hidePortActions={isDrawingLink}
                            editNode={editNode}
                            removeNode={removeNode}
                            onPortAdd={onPortAdd}
                            onPortEvent={onPortEvent}
                            onPortRemove={onPortRemove}
                            onDragStop={onNodePositionUpdate}
                            onDrag={onNodeDrag}
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
