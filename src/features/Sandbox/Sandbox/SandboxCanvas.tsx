import { Icon, Input } from 'antd';
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
    getDrawLinkRef: (element: SVGPathElement) => void;
    isDrawing: boolean;
    nodes: NodeController[];
    links: LinkController[];
    size?: { width: number; height: number };
    visibleLinks?: boolean;
}

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    sandboxManager,
    getDrawLinkRef,
    isDrawing,
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
        <div className="sandbox">
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
                            visible={visibleLinks}
                            getRef={l.getElementRef}
                        />
                    ))}
                    {isDrawing && (
                        <Link visible={true} getRef={getDrawLinkRef} />
                    )}
                </div>
                <div className="nodes">
                    {nodes.map(n => (
                        <SandboxNode
                            key={n.id}
                            getRef={n.getElementRef}
                            onPortEvent={n.onPortEvent}
                            data={n.nodeData}
                            removeNode={sandboxManager.removeNode}
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
        </div>
    );
};
