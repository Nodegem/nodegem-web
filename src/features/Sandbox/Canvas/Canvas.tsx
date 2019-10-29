import { Badge, Button, Icon, Input, Menu } from 'antd';
import classNames from 'classnames';
import { ContextMenu, Loader } from 'components';
import { useStore } from 'overstated';
import React, { useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Link } from '..';
import { Node } from '../Node';
import { CanvasStore, DrawLinkStore } from '../stores';
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

interface ILinkNodeProps {
    links: ILinkUIData[];
    nodes: INodeUIData[];
    linksVisible: boolean;
    drawLinkStore: DrawLinkStore;
    scale: number;
    isDrawingLink: boolean;
    onPortEvent: (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData,
        nodeId: string
    ) => void;
    onPortAdd: (port: IPortUIData) => void;
    onPortRemove: (port: IPortUIData) => void;
    onNodeDrag: (id: string) => void;
    onNodePositionUpdate: (id: string, position: Vector2) => void;
    onNodeDblClick: (event: MouseEvent, nodeId: string) => void;
    onNodeClick: (event: MouseEvent, nodeId: string) => void;
    onNodeRightClick: (event: MouseEvent, nodeId: string) => void;
}

const CanvasLinksNodes: React.FC<ILinkNodeProps> = ({
    links,
    nodes,
    linksVisible,
    drawLinkStore,
    scale,
    isDrawingLink,
    onPortAdd,
    onPortRemove,
    onNodeDrag,
    onNodePositionUpdate,
    onPortEvent,
    onNodeDblClick,
    onNodeClick,
    onNodeRightClick,
}) => (
    <>
        <div className="links" style={{ position: 'absolute' }}>
            {links.map(l => (
                <Link key={l.id} linkId={l.id} visible={linksVisible} {...l} />
            ))}
            <DrawLink drawLinkStore={drawLinkStore} />
        </div>
        <div className="nodes">
            {nodes.map(n => (
                <Node
                    scale={scale}
                    key={n.id}
                    initialPosition={n.position}
                    flowInputs={n.flowInputs}
                    flowOutputs={n.flowOutputs}
                    valueInputs={n.valueInputs}
                    valueOutputs={n.valueOutputs}
                    hidePortActions={isDrawingLink}
                    onPortAdd={onPortAdd}
                    onPortEvent={onPortEvent}
                    onPortRemove={onPortRemove}
                    onDragStop={onNodePositionUpdate}
                    onDrag={onNodeDrag}
                    onDblClick={onNodeDblClick}
                    onClick={onNodeClick}
                    onRightClick={onNodeRightClick}
                    nodeId={n.id}
                    {...n}
                />
            ))}
        </div>
    </>
);

export interface ISandboxProps {
    canvasStore: CanvasStore;
    isLoading: boolean;
    hasUnreadLogs: boolean;
    size?: Dimensions;
}

export const Canvas: React.FC<ISandboxProps> = ({
    isLoading,
    canvasStore,
    hasUnreadLogs,
    size = { width: 12000, height: 12000 },
}: ISandboxProps) => {
    const storeData = useStore(canvasStore, store => ({
        canToggleConsole: store.ctx.logsStore.canToggle,
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
        toggleLogView: store.ctx.logsStore.toggleOpen,
        onNodeDblClick: store.onNodeDblClick,
        onNodeClick: store.onNodeClick,
        onNodeRightClick: store.onNodeRightClick,
        hasActiveTab: !!store.ctx.tabsStore.state.activeTabId,
        scale: store.state.scale,
        ...store.state,
    }));

    const {
        canToggleConsole,
        isConsoleLoading,
        resetView,
        toggleLogView,
        openContext,
        editNode,
        removeNode,
        hasActiveTab,
    } = storeData;

    const canvasRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const canvasElement = canvasRef.current!;
        canvasStore.bindElement(canvasElement, size);
    }, []);

    return (
        <>
            <div
                className={classNames({
                    sandbox: true,
                    disabled: isLoading || !hasActiveTab,
                })}
            >
                {isLoading ? <Loader size={9} /> : <SandboxDropContainer />}
                <div
                    className={classNames({ canvas: true, isLoading })}
                    ref={canvasRef}
                >
                    <CanvasLinksNodes {...storeData} />
                </div>
                <div className="footer">
                    <div className="bottom-left-footer">
                        <Input
                            prefix={<Icon type="search" />}
                            onChange={event => {}}
                            allowClear
                            placeholder="Search Nodes"
                        />
                        <Badge count={hasUnreadLogs ? 1 : 0} dot>
                            <Button
                                disabled={!canToggleConsole}
                                shape="circle"
                                type="primary"
                                icon="code"
                                loading={isConsoleLoading}
                                onClick={() => toggleLogView(true)}
                            />
                        </Badge>
                    </div>
                    <div className="bottom-right-footer">
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
            </div>
            <ContextMenu trigger="data-node">
                <Menu theme="dark">
                    <Menu.Item onMouseDown={() => editNode(openContext!.id)}>
                        <Icon type="edit" />
                        Edit
                    </Menu.Item>
                    <Menu.Item
                        disabled={openContext && !openContext.canDelete}
                        onMouseDown={() => removeNode(openContext!.id)}
                    >
                        <Icon type="delete" />
                        Delete
                    </Menu.Item>
                </Menu>
            </ContextMenu>
        </>
    );
};
