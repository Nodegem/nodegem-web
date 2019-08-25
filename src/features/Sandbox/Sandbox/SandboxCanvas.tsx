import { observer, useObserver } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useStore } from 'stores';
import { Link } from '../Link/Link';
import { SandboxNode } from '../Node';
import { fakeNodeData } from '../SandboxView';
import SandboxManager from './sandbox-manager';
import './SandboxCanvas.less';

export const sandboxDroppableId = 'sandboxId';

export interface ISandboxProps {
    manager: SandboxManager;
    graph?: Graph | Macro;
    size?: { width: number; height: number };
}

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    graph,
    manager,
    size = { width: 12000, height: 12000 },
}: ISandboxProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current!;
        manager.setProperties(canvasElement, size);
        console.log(graph);

        if (graph) {
            // manager.load(graph.nodes);
        }
    }, [canvasRef, manager, graph]);

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
                    {/* {manager &&
                        manager.nodes.map((n, index) => (
                            <SandboxNode
                                key={index}
                                getRef={n.getElementRef}
                                onPortDown={n.onPortDown}
                                data={n.nodeData}
                            />
                        ))} */}
                </div>
            </div>
        </div>
    );
};
