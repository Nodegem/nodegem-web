import { Button, Icon, Input } from 'antd';
import classNames from 'classnames';
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
    editNode,
    isActive,
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
    }, [sandboxManager]);

    return (
        <div className={classNames({ sandbox: true, disabled: !isActive })}>
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
            <div className="canvas" ref={canvasRef}>
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
                        />
                    ))}
                </div>
            </div>
            <div className="search">
                <Input
                    prefix={<Icon type="search" />}
                    allowClear
                    placeholder="Search Nodes"
                />
            </div>
            <div className="zoom-controls">
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
