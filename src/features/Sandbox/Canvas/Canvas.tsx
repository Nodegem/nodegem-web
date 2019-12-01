import { Badge, Button, Icon, Input, Menu } from 'antd';
import classNames from 'classnames';
import { ContextMenu, Loader } from 'components';
import { useStore } from 'overstated';
import React, { useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Link } from '..';
import { Node } from '../Node';
import { NodeGrouping } from '../NodeGrouping';
import { CanvasStore, DrawLinkStore } from '../stores';
import './Canvas.less';

import { DrawLink } from './DrawLink';

const magnifyAmount = 0.25;

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
    nodeGroupings: { id: string; title: string }[];
    linksVisible: boolean;
    drawLinkStore: DrawLinkStore;
    isDrawingLink: boolean;
    onLinkSourceClick: (linkId: string) => void;
    onLinkDestinationClick: (linkId: string) => void;
    onPortEvent: (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData,
        nodeId: string
    ) => void;
    onPortAdd: (port: IPortUIData) => void;
    onPortRemove: (port: IPortUIData) => void;
    onNodeDblClick: (event: MouseEvent, nodeId: string) => void;
    onNodeMouseDown: (event: MouseEvent, nodeId: string) => void;
    onNodeMouseUp: (event: MouseEvent, nodeId: string) => void;
    onNodeRightClick: (event: MouseEvent, nodeId: string) => void;
    onNodeGroupingTitleChange: (id: string, value: string) => void;
    onNodeGroupingMouseDown: (id: string, event: MouseEvent) => void;
    onNodeGroupingResize: (id: string, size: Vector2) => void;
    onNodeGroupingDelete: (id: string) => void;
}

const CanvasLinksNodes: React.FC<ILinkNodeProps> = ({
    links,
    nodes,
    nodeGroupings,
    linksVisible,
    drawLinkStore,
    isDrawingLink,
    onLinkSourceClick,
    onLinkDestinationClick,
    onPortAdd,
    onPortRemove,
    onPortEvent,
    onNodeDblClick,
    onNodeMouseDown,
    onNodeMouseUp,
    onNodeRightClick,
    onNodeGroupingMouseDown,
    onNodeGroupingTitleChange,
    onNodeGroupingResize,
    onNodeGroupingDelete,
}) => (
    <>
        <div className="node-groupings" style={{ position: 'absolute' }}>
            {nodeGroupings.map(ng => (
                <NodeGrouping
                    key={ng.id}
                    {...ng}
                    onMouseDown={onNodeGroupingMouseDown}
                    onTitleChange={onNodeGroupingTitleChange}
                    onResize={onNodeGroupingResize}
                    onDelete={onNodeGroupingDelete}
                />
            ))}
        </div>
        <div className="links" style={{ position: 'absolute' }}>
            {links.map(l => (
                <Link
                    key={l.id}
                    linkId={l.id}
                    onSourceIconClick={onLinkSourceClick}
                    onDestinationIconClick={onLinkDestinationClick}
                    visible={linksVisible}
                    {...l}
                />
            ))}
            <DrawLink drawLinkStore={drawLinkStore} />
        </div>
        <div className="nodes">
            {nodes.map(n => (
                <Node
                    isMacro={!!n.macroId}
                    key={n.id}
                    flowInputs={n.flowInputs}
                    flowOutputs={n.flowOutputs}
                    valueInputs={n.valueInputs}
                    valueOutputs={n.valueOutputs}
                    hidePortActions={isDrawingLink}
                    onPortAdd={onPortAdd}
                    onPortEvent={onPortEvent}
                    onPortRemove={onPortRemove}
                    onDblClick={onNodeDblClick}
                    onMouseDown={onNodeMouseDown}
                    onMouseUp={onNodeMouseUp}
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
        resetView: store.resetView,
        editNode: store.editNode,
        removeNode: store.removeNode,
        onPortAdd: store.onPortAdd,
        onPortRemove: store.onPortRemove,
        onPortEvent: store.onPortEvent,
        drawLinkStore: store.drawLinkStore,
        onNodeDblClick: store.onNodeDblClick,
        onNodeMouseDown: store.onNodeMouseDown,
        onNodeMouseUp: store.onNodeMouseUp,
        onNodeRightClick: store.onNodeRightClick,
        hasActiveTab: !!store.ctx.tabsStore.state.activeTabId,
        onLinkSourceClick: store.onLinkSourceClick,
        onLinkDestinationClick: store.onLinkDestinationClick,
        magnify: store.magnify,
        onNodeGroupingMouseDown: store.onNodeGroupingMouseDown,
        onNodeGroupingTitleChange: store.onNodeGroupingTitleChange,
        onNodeGroupingResize: store.onNodeGroupingResize,
        onNodeGroupingDelete: store.onNodeGroupingDelete,
        ...store.state,
    }));

    const { canToggleConsole, isConsoleLoading, toggleLogView } = useStore(
        canvasStore.ctx.logsStore,
        store => ({
            canToggleConsole: store.canToggle,
            isConsoleLoading: store.state.isLoading,
            toggleLogView: store.toggleOpen,
        })
    );

    const { handleSearchChange } = useStore(canvasStore.searchStore, store => ({
        handleSearchChange: store.handleSearchChange,
    }));

    const { hasActiveTab } = useStore(canvasStore.ctx.tabsStore, store => ({
        hasActiveTab: store.hasActiveTab,
    }));

    const { isDrawingLink } = useStore(canvasStore.drawLinkStore, store => ({
        isDrawingLink: store.state.isDrawing,
    }));

    const { resetView, openContext, editNode, removeNode } = storeData;

    const canvasRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<Input>(null);
    useEffect(() => {
        const canvasElement = canvasRef.current!;
        canvasStore.bindElement(canvasElement, size);
        canvasStore.setSearchRef(searchRef);
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
                    <CanvasLinksNodes
                        {...storeData}
                        isDrawingLink={isDrawingLink}
                    />
                </div>
                <div className="footer">
                    <div className="bottom-left-footer">
                        <Input
                            ref={searchRef}
                            prefix={<Icon type="search" />}
                            onChange={handleSearchChange}
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
                            onClick={() => storeData.magnify(-magnifyAmount)}
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
                            onClick={() => storeData.magnify(magnifyAmount)}
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
