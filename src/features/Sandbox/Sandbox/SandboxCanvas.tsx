import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useStore } from 'stores';
import { Link } from '../Link/Link';
import { SandboxNode } from '../Node';
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
            const canvas = new SandboxManager<string>(canvasElement, size);

            canvas.load(['1']);

            sandboxCanvasStore.sandboxManager = canvas;
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
                        {sandboxManager && null
                        /* <Link
                            visible={sandboxCanvasStore.isDrawingLink}
                            source={{ x: 0, y: 0 }}
                            destination={{ x: 0, y: 0 }}
                        /> */
                        }
                    </div>
                    <div className="nodes">
                        {sandboxManager &&
                            sandboxManager.nodes.map((n, index) => (
                                <SandboxNode
                                    key={index}
                                    getRef={n.getElementRef}
                                    name={n.nodeData}
                                />
                            ))}
                    </div>
                </div>
            </div>
        );
    }
);
