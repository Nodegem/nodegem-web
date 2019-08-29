import React, { useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Link } from '../Link/Link';
import { SandboxNode } from '../Node';
import NodeController from '../Node/node-controller';
import SandboxManager from './sandbox-manager';
import './SandboxCanvas.less';

export const sandboxDroppableId = 'sandboxId';

export interface ISandboxProps {
    sandboxManager: SandboxManager;
    nodes: NodeController[];
    link?: { source: Vector2; destination: Vector2; type: PortType };
    size?: { width: number; height: number };
}

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    sandboxManager,
    nodes = [],
    link,
    size = { width: 12000, height: 12000 },
}: ISandboxProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current!;
        sandboxManager.setProperties(canvasElement, size);
    }, [link, nodes]);

    return (
        <div className="sandbox">
            <Droppable droppableId={sandboxDroppableId}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className="droppable-area"
                        {...provided.droppableProps}
                        style={{ width: '100%', height: '100%' }}
                    />
                )}
            </Droppable>
            <div className="canvas" ref={canvasRef}>
                <div className="links" style={{ position: 'absolute' }}>
                    {link && (
                        <Link
                            visible={true}
                            source={link.source}
                            destination={link.destination}
                            type={link.type}
                        />
                    )}
                </div>
                <div className="nodes">
                    {nodes.map(n => (
                        <SandboxNode
                            key={n.id}
                            getRef={n.getElementRef}
                            onPortEvent={n.onPortEvent}
                            data={n.nodeData}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
