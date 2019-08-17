import React from 'react';

import './Node.less';

interface INodeProps {
    name: string;
    showPorts?: boolean;
    getRef?: (instance: HTMLDivElement) => void;
}

export const Node: React.FC<INodeProps> = props => {
    const { getRef, name, showPorts, ...rest } = props;

    const attemptRef = (instance: HTMLDivElement) => {
        if (props.getRef) {
            props.getRef(instance);
        }
    };

    return (
        <div ref={attemptRef} className="node-container" {...rest}>
            <div className="flow flow-inputs">
                <span />
            </div>
            <div className="inner">
                <div className="value value-inputs">
                    <span className="port" />
                </div>
                <span className="title">{props.name}</span>
                <div className="value value-outputs">
                    <span className="port" />
                    <span className="port" />
                </div>
            </div>
            <div className="flow flow-outputs">
                <span />
            </div>
        </div>
    );
};

export const SandboxNode: React.FC<INodeProps> = props => {
    const style: React.CSSProperties = { position: 'absolute' };
    return React.cloneElement(<Node {...props} showPorts />, { style });
};
