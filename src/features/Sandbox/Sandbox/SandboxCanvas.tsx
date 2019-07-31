import React, { useEffect, useRef } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import CanvasContainer from './Canvas/canvas-container';
import './SandboxCanvas.less';

export interface ISandboxProps {
    size?: { width: number; height: number };
}

function getStyle(style, snapshot) {
    if (!snapshot.isDropAnimating) {
        return style;
    }
    return {
        ...style,
        // cannot be 0, but make it super tiny
        transitionDuration: `0.001s`,
    };
}

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    size = { width: 32000, height: 32000 },
}: ISandboxProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const { width, height } = size;
    const left = width / 2;
    const top = height / 2;

    useEffect(() => {
        const canvasElement = canvasRef.current!;
        const canvas = new CanvasContainer(canvasElement, {
            top: -top,
            left: -left,
            width,
            height,
        });
    }, [canvasRef]);

    return (
        <div className="sandbox">
            <Droppable droppableId="test">
                {(provided, snapshot) => (
                    <div
                        className="canvas"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <div
                            ref={canvasRef}
                            className="view-container"
                            style={{
                                top: -top,
                                left: -left,
                                width,
                                height,
                            }}
                        />
                    </div>
                )}
            </Droppable>
        </div>
    );
};
