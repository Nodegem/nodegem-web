import React from 'react';

import { Socket as Port } from '../Port/Port';
import './Node.less';

interface INodeProps {
    data: INodeData;
    showPorts?: boolean;
    getRef?: (instance: HTMLDivElement) => void;
    onPortDown?: (event: MouseEvent, data: IPortData) => void;
}

export const Node: React.FC<INodeProps> = ({
    getRef,
    data,
    showPorts,
    onPortDown,
    ...rest
}: INodeProps) => {
    const attemptRef = (instance: HTMLDivElement) => {
        if (getRef) {
            getRef(instance);
        }
    };

    const { portData, title } = data;
    const { flowInputs, flowOutputs, valueInputs, valueOutputs } = portData;

    return (
        <div ref={attemptRef} className="node-container" {...rest}>
            <div className="flow flow-inputs">
                {flowInputs.map(fi => (
                    <Port key={fi.id} data={fi} onPortDown={onPortDown} />
                ))}
            </div>
            <div className="inner">
                <div className="value value-inputs">
                    {valueInputs.map(vi => (
                        <Port key={vi.id} data={vi} onPortDown={onPortDown} />
                    ))}
                </div>
                <span className="title">{title}</span>
                <div className="value value-outputs">
                    {valueOutputs.map(vo => (
                        <Port key={vo.id} data={vo} onPortDown={onPortDown} />
                    ))}
                </div>
            </div>
            <div className="flow flow-outputs">
                {flowOutputs.map(fo => (
                    <Port key={fo.id} data={fo} onPortDown={onPortDown} />
                ))}
            </div>
        </div>
    );
};

export const SandboxNode: React.FC<INodeProps> = props => {
    const style: React.CSSProperties = { position: 'absolute' };
    return React.cloneElement(<Node {...props} showPorts />, { style });
};
