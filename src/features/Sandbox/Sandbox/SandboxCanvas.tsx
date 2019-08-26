import { observer, useObserver } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { SandboxStore, useStore } from 'stores';
import { Link } from '../Link/Link';
import { SandboxNode } from '../Node';
import NodeController from '../Node/node-controller';
import './SandboxCanvas.less';

export const sandboxDroppableId = 'sandboxId';

export interface ISandboxProps {
    sandboxStore: SandboxStore;
    nodes: NodeController[];
    size?: { width: number; height: number };
}

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    sandboxStore,
    nodes = [],
    size = { width: 12000, height: 12000 },
}: ISandboxProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current!;
        sandboxStore.sandboxManager.setProperties(canvasElement, size);
    }, [canvasRef, nodes]);

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
                    {/* {manager && (
                        <Link
                            visible={true}
                            source={{ x: 0, y: 0 }}
                            destination={{ x: 350, y: -20 }}
                        />
                    )} */}
                </div>
                <div className="nodes">
                    {nodes.map((n, index) => (
                        <SandboxNode
                            key={index}
                            getRef={n.getElementRef}
                            onPortDown={n.onPortDown}
                            data={n.nodeData}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
