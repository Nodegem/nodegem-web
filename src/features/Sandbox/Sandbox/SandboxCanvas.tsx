import React, { useEffect, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import CanvasContainer from './Canvas/canvas-container';
import './SandboxCanvas.less';

export const sandboxDroppableId = 'sandboxId';

export interface ISandboxProps {
    size?: { width: number; height: number };
}

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    size = { width: 32000, height: 32000 },
}: ISandboxProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const { width, height } = size;
    const { halfWidth, halfHeight } = {
        halfWidth: width / 2,
        halfHeight: height / 2,
    };
    const bounds = {
        top: -halfWidth,
        left: -halfHeight,
        width: halfWidth,
        height: halfHeight,
    };

    useEffect(() => {
        const canvasElement = canvasRef.current!;
        const canvas = new CanvasContainer(canvasElement, bounds);

        function handleKeyPress(event: KeyboardEvent) {
            if (event.keyCode === 32) {
                canvas.reset();
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
