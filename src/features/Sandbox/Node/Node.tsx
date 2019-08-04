import React from 'react';

import './Node.less';

interface INodeProps {
    name: string;
    getRef?: (instance: HTMLDivElement) => void;
}

export const Node: React.FC<INodeProps> = props => {
    const { getRef, name, ...rest } = props;

    const attemptRef = (instance: HTMLDivElement) => {
        if (props.getRef) {
            props.getRef(instance);
        }
    };
    return (
        <div ref={attemptRef} className="node-container" {...rest}>
            {props.name}
        </div>
    );
};

export const SandboxNode: React.FC<INodeProps> = props => {
    const style: React.CSSProperties = { position: 'absolute' };
    return React.cloneElement(<Node {...props} />, { style });
};
