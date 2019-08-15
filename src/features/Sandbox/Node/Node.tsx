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
            <span>{props.name}</span>

            {showPorts && (
                <div className="value-inputs">
                    <span className="port" />
                </div>
            )}
        </div>
    );
};

export const SandboxNode: React.FC<INodeProps> = props => {
    const style: React.CSSProperties = { position: 'absolute' };
    return React.cloneElement(<Node {...props} showPorts />, { style });
};
