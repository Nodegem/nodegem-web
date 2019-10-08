import { Badge, Button, Icon, Input, Spin } from 'antd';
import classNames from 'classnames';
import { Loader } from 'components';
import React, { useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Link } from '../Link/Link';
import LinkController from '../Link/link-controller';
import { SandboxNode } from '../Node';
import NodeController from '../Node/node-controller';
import SandboxManager from './sandbox-manager';
import './SandboxCanvas.less';

export const sandboxDroppableId = 'sandboxId';

export interface ISandboxProps {
    sandboxManager: SandboxManager;
    onFilter: (text: string) => void;
    toggleConsole: () => void;
    canToggleConsole?: boolean;
    isConsoleLoading?: boolean;
    unreadLogCount: number;
    loading: boolean;
    isActive?: boolean;
    editNode: (data: INodeUIData) => void;
    getDrawLinkRef: (element: SVGPathElement) => void;
    isDrawing: boolean;
    linkType?: PortType;
    nodes: NodeController[];
    links: LinkController[];
    size?: { width: number; height: number };
    visibleLinks?: boolean;
}

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    sandboxManager,
    loading,
    onFilter,
    editNode,
    isActive,
    toggleConsole,
    canToggleConsole,
    isConsoleLoading,
    unreadLogCount,
    getDrawLinkRef,
    isDrawing,
    linkType,
    nodes = [],
    links = [],
    visibleLinks = true,
    size = { width: 12000, height: 12000 },
}: ISandboxProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current!;
        sandboxManager.setProperties(canvasElement, size);
    }, [sandboxManager, loading]);

    return (
        <div
            className={classNames({
                sandbox: true,
                disabled: loading || !isActive,
            })}
        >
            {loading && <Loader size={9} />}
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
            <div
                className={classNames({ canvas: true, loading })}
                ref={canvasRef}
            >
                <div className="links" style={{ position: 'absolute' }}>
                    {links.map(l => (
                        <Link
                            key={l.id}
                            type={l.type}
                            visible={visibleLinks}
                            getRef={l.getElementRef}
                        />
                    ))}
                    <Link
                        visible={isDrawing}
                        type={linkType!}
                        getRef={getDrawLinkRef}
                    />
                </div>
                <div className="nodes">
                    {nodes.map(n => (
                        <SandboxNode
                            key={n.id}
                            getRef={n.getElementRef}
                            getPortRef={n.getPortRef}
                            removePortRef={n.removePortRef}
                            onPortEvent={n.onPortEvent}
                            data={n.nodeData}
                            editNode={editNode}
                            removeNode={sandboxManager.removeNode}
                            onPortAdd={n.addPort}
                            onPortRemove={n.removePort}
                            hidePortActions={isDrawing}
                        />
                    ))}
                </div>
            </div>
            <div className="footer bottom-left-footer">
                <Input
                    prefix={<Icon type="search" />}
                    onChange={event => onFilter(event.target!.value)}
                    allowClear
                    placeholder="Search Nodes"
                />
                <Badge count={unreadLogCount} dot>
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
                    onClick={() => sandboxManager.magnify(-0.15)}
                />
                <Button
                    type="primary"
                    shape="circle"
                    icon="block"
                    onClick={sandboxManager.resetView}
                />
                <Button
                    type="primary"
                    shape="circle"
                    icon="plus"
                    onClick={() => sandboxManager.magnify(0.15)}
                />
            </div>
        </div>
    );
};
