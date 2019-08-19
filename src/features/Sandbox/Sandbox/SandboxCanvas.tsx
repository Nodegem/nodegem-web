import { observer, useObserver } from 'mobx-react-lite';
import React, { useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useStore } from 'stores';
import { SandboxNode } from '../Node';
import { fakeNodeData } from '../SandboxView';
import SandboxManager from './sandbox-manager';
import './SandboxCanvas.less';

export const sandboxDroppableId = 'sandboxId';

export interface ISandboxProps {
    size?: { width: number; height: number };
}

export const SandboxCanvas: React.FC<ISandboxProps> = observer(
    ({ size = { width: 12000, height: 12000 } }: ISandboxProps) => {
        const canvasRef = useRef<HTMLDivElement>(null);
        const { sandboxCanvasStore } = useStore();
        const { sandboxManager } = sandboxCanvasStore;

        useEffect(() => {
            const canvasElement = canvasRef.current!;
            const manager = new SandboxManager(canvasElement, size);
            sandboxCanvasStore.setManager(manager);

            sandboxCanvasStore.loadNodes(fakeNodeData);
        }, [canvasRef]);

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
                    <div
                        className="links"
                        style={{ position: 'absolute', zIndex: -1 }}
                    >
                        <div />
                    </div>
                    <div className="nodes">
                        {sandboxManager &&
                            sandboxManager.nodes.map((n, index) => (
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
    }
);
