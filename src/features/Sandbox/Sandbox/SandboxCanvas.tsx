import React, { useEffect, useRef, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { SandboxNode } from '../Node';
import SandboxManager from './sandbox-manager';
import './SandboxCanvas.less';

export const sandboxDroppableId = 'sandboxId';

export interface ISandboxProps {
    size?: { width: number; height: number };
}

type SandboxState = {
    manager: SandboxManager<string> | null;
};

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    size = { width: 12000, height: 12000 },
}: ISandboxProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<SandboxState>({
        manager: null,
    });

    const testNodes = ['1', '2', '3'];

    useEffect(() => {
        const canvasElement = canvasRef.current!;
        const canvas = new SandboxManager<string>(canvasElement, size);
        canvas.load(testNodes);

        setState({ manager: canvas });

        function handleKeyPress(event: KeyboardEvent) {
            if (event.keyCode === 32) {
                canvas.resetView();
            }
        }

        window.addEventListener('keypress', handleKeyPress);
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
                {state.manager &&
                    state.manager.nodes.map((n, index) => (
                        <SandboxNode
                            key={index}
                            getRef={n.getElementRef}
                            name={n.nodeData}
                        />
                    ))}
            </div>
        </div>
    );
};
