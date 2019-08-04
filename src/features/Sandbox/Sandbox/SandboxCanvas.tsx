import React, { useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import CanvasContainer from './Canvas/canvas-container';
import SandboxManager from './sandbox-manager';
import './SandboxCanvas.less';

export const sandboxDroppableId = 'sandboxId';

export interface ISandboxProps {
    size?: { width: number; height: number };
}

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    size = { width: 12000, height: 12000 },
}: ISandboxProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    const testNodes = ['1', '2', '3'];

    useEffect(() => {
        const canvasElement = canvasRef.current!;
        const canvas = new SandboxManager(canvasElement, size);

        function handleKeyPress(event: KeyboardEvent) {
            if (event.keyCode === 32) {
                canvas.resetView();
            }
        }

        window.addEventListener('keypress', handleKeyPress);
    }, [canvasRef]);

    return (
        <Droppable droppableId={sandboxDroppableId}>
            {(provided, snapshot) => (
                <div
                    className="sandbox"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <div className="canvas" ref={canvasRef} />
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};
