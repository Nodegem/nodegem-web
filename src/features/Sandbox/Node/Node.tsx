import React from 'react';

import { Socket as Port } from '../Port/Port';
import './Node.less';

interface INodeProps {
    data: INodeData;
    showPorts?: boolean;
    getRef?: (instance: HTMLDivElement) => void;
    onPortEvent?: (
        event: PortEvent,
        element: HTMLElement,
        data: IPortData
    ) => void;
}

export const Node: React.FC<INodeProps> = ({
    getRef,
    data,
    showPorts,
    onPortEvent,
    ...rest
}: INodeProps) => {
    const { portData, title } = data;
    const { flowInputs, flowOutputs, valueInputs, valueOutputs } = portData;

    const attemptRef = (instance: HTMLDivElement) => {
        if (getRef) {
            getRef(instance);
        }
    };

    return (
        <div ref={attemptRef} className="node-container" {...rest}>
            <div className="flow flow-inputs">
                {showPorts &&
                    flowInputs.map(fi => (
                        <Port key={fi.id} data={fi} onPortEvent={onPortEvent} />
                    ))}
            </div>
            <div className="inner">
                <div className="value value-inputs">
                    {showPorts &&
                        valueInputs.map(vi => (
                            <Port
                                key={vi.id}
                                data={vi}
                                onPortEvent={onPortEvent}
                            />
                        ))}
                </div>
                <span className="title">{title}</span>
                <div className="value value-outputs">
                    {showPorts &&
                        valueOutputs.map(vo => (
                            <Port
                                key={vo.id}
                                data={vo}
                                onPortEvent={onPortEvent}
                            />
                        ))}
                </div>
            </div>
            <div className="flow flow-outputs">
                {showPorts &&
                    flowOutputs.map(fo => (
                        <Port key={fo.id} data={fo} onPortEvent={onPortEvent} />
                    ))}
            </div>
        </div>
    );
};

export const SandboxNode: React.FC<INodeProps> = props => {
    const style: React.CSSProperties = { position: 'absolute' };
    return React.cloneElement(<Node {...props} showPorts />, { style });
};
