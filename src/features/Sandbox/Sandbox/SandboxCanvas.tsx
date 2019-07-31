import React, { useEffect, useRef } from 'react';
import CanvasContainer from './Canvas/canvas-container';
import './SandboxCanvas.less';

export const SandboxCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current!;
        const canvas = new CanvasContainer(canvasElement);
    }, [canvasRef]);

    return (
        <div className="sandbox">
            <div ref={canvasRef} className="pannable-canvas">
                Test
            </div>
        </div>
    );
};
