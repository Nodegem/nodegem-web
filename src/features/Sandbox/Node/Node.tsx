import React from 'react';

import { Button, Tooltip } from 'antd';
import { Socket as Port } from '../Port/Port';
import './Node.less';

interface INodeProps {
    data: INodeUIData;
    sandboxMode?: boolean;
    removeNode?: (id: string) => void;
    getRef?: (instance: HTMLDivElement) => void;
    onPortEvent?: (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData
    ) => void;
}

const ToolbarContents: React.FC<IToolbarProps> = ({ nodeData, remove }) => {
    return (
        <span className="toolbar">
            <Button
                onClick={() => remove(nodeData.id)}
                type="danger"
                icon="delete"
            />
        </span>
    );
};

interface IToolbarProps {
    sandboxMode?: boolean;
    nodeData: INodeUIData;
    remove: (id: string) => void;
}

const Toolbar: React.FC<IToolbarProps> = ({
    remove,
    nodeData,
    sandboxMode,
    children,
}) => {
    return sandboxMode ? (
        <Tooltip
            trigger="contextMenu"
            className="toolbar-tooltip"
            title={<ToolbarContents remove={remove} nodeData={nodeData} />}
        >
            {children}
        </Tooltip>
    ) : (
        <>{children}</>
    );
};

export const Node: React.FC<INodeProps> = ({
    getRef,
    data,
    removeNode = () => {},
    sandboxMode,
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
        <Toolbar remove={removeNode!} nodeData={data} sandboxMode={sandboxMode}>
            <div ref={attemptRef} className="node-container" {...rest}>
                <div className="flow flow-inputs">
                    {flowInputs.map(fi => (
                        <Port
                            key={fi.id}
                            data={fi}
                            onPortEvent={onPortEvent}
                            sandboxMode={sandboxMode}
                        />
                    ))}
                </div>
                <div className="inner">
                    <div className="value value-inputs">
                        {valueInputs.map(vi => (
                            <Port
                                key={vi.id}
                                data={vi}
                                onPortEvent={onPortEvent}
                                sandboxMode={sandboxMode}
                            />
                        ))}
                    </div>
                    <span className="title">{title}</span>
                    <div className="value value-outputs">
                        {valueOutputs.map(vo => (
                            <Port
                                key={vo.id}
                                data={vo}
                                onPortEvent={onPortEvent}
                                sandboxMode={sandboxMode}
                            />
                        ))}
                    </div>
                </div>
                <div className="flow flow-outputs">
                    {flowOutputs.map(fo => (
                        <Port
                            key={fo.id}
                            data={fo}
                            onPortEvent={onPortEvent}
                            sandboxMode={sandboxMode}
                        />
                    ))}
                </div>
            </div>
        </Toolbar>
    );
};

export const SandboxNode: React.FC<INodeProps> = props => {
    const style: React.CSSProperties = { position: 'absolute' };
    return React.cloneElement(<Node {...props} sandboxMode />, { style });
};
