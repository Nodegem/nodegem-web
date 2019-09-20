import React, { useEffect, useRef, useState } from 'react';

import { Button, Tooltip } from 'antd';
import { Socket as Port } from '../Port/Port';
import './Node.less';

interface INodeProps {
    data: INodeUIData;
    sandboxMode?: boolean;
    editNode?: (nodeData: INodeUIData) => void;
    removeNode?: (id: string) => void;
    getRef?: (instance: HTMLDivElement) => void;
    getPortRef?: (port: IPortUIData, element: HTMLElement) => void;
    removePortRef?: (id: string) => void;
    onPortAdd?: (port: IPortUIData) => void;
    onPortEvent?: (
        event: PortEvent,
        element: HTMLElement,
        data: IPortUIData
    ) => void;
}

const ToolbarContents: React.FC<IToolbarProps> = ({
    nodeData,
    edit,
    remove,
    forceClose,
}) => {
    return (
        <span className="toolbar">
            <Button
                onClick={() => {
                    edit(nodeData);
                    forceClose();
                }}
                type="primary"
                icon="edit"
            />
            <Button
                onClick={() => remove(nodeData.id)}
                type="danger"
                icon="delete"
            />
        </span>
    );
};

interface IToolbarProps {
    visible?: boolean;
    sandboxMode?: boolean;
    nodeData: INodeUIData;
    edit: (data: INodeUIData) => void;
    remove: (id: string) => void;
    forceClose: () => void;
}

const Toolbar: React.FC<IToolbarProps> = ({
    visible,
    remove,
    edit,
    forceClose,
    nodeData,
    sandboxMode,
    children,
}) => {
    return sandboxMode ? (
        <Tooltip
            visible={visible}
            className="toolbar-tooltip"
            title={
                <ToolbarContents
                    edit={edit}
                    remove={remove}
                    nodeData={nodeData}
                    forceClose={forceClose}
                />
            }
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
    editNode = () => {},
    removeNode = () => {},
    onPortAdd = () => {},
    getPortRef,
    removePortRef,
    sandboxMode,
    onPortEvent,
    ...rest
}: INodeProps) => {
    const { portData, title } = data;
    const { flowInputs, flowOutputs, valueInputs, valueOutputs } = portData;
    const container = useRef<HTMLDivElement>(null);
    const [visibleToolbar, setVisible] = useState(false);

    useEffect(() => {
        if (getRef) {
            getRef(container.current!);
        }

        if (!sandboxMode) {
            return;
        }

        const preventDefault = (event: MouseEvent) => {
            event.preventDefault();
            event.stopPropagation();
        };

        const disable = (event: MouseEvent) => {
            if (event.button === 2) {
                event.stopPropagation();
                event.preventDefault();
                setVisible(!visibleToolbar);
            } else {
                setVisible(false);
            }
        };

        const outsideClick = (event: MouseEvent) => {
            if (visibleToolbar) {
                event.preventDefault();
                event.stopPropagation();
                setVisible(false);
            }
        };

        window.addEventListener('contextmenu', outsideClick);
        container.current!.addEventListener('mousedown', disable);
        container.current!.addEventListener('contextmenu', preventDefault);
        return () => {
            if (!sandboxMode) {
                return;
            }

            window.removeEventListener('contextmenu', outsideClick);
            container.current!.removeEventListener('mousedown', disable);
            container.current!.removeEventListener(
                'contextmenu',
                preventDefault
            );
        };
    }, [container, visibleToolbar]);

    const closeToolbar = () => setVisible(false);

    return (
        <Toolbar
            forceClose={closeToolbar}
            visible={visibleToolbar}
            edit={editNode}
            remove={removeNode}
            nodeData={data}
            sandboxMode={sandboxMode}
        >
            <div ref={container} className="node-container" {...rest}>
                <div className="flow flow-inputs">
                    {flowInputs.map((fi, i) => (
                        <Port
                            getPortRef={getPortRef}
                            removePortRef={removePortRef}
                            key={fi.id}
                            data={fi}
                            onPortEvent={onPortEvent}
                            sandboxMode={sandboxMode}
                            onAddPort={onPortAdd}
                            lastPort={i === flowInputs.length - 1}
                        />
                    ))}
                </div>
                <div className="inner">
                    <div className="value value-inputs">
                        {valueInputs.map((vi, i) => (
                            <Port
                                getPortRef={getPortRef}
                                removePortRef={removePortRef}
                                key={vi.id}
                                data={vi}
                                onPortEvent={onPortEvent}
                                sandboxMode={sandboxMode}
                                onAddPort={onPortAdd}
                                lastPort={i === valueInputs.length - 1}
                            />
                        ))}
                    </div>
                    <span className="title">{title}</span>
                    <div className="value value-outputs">
                        {valueOutputs.map((vo, i) => (
                            <Port
                                getPortRef={getPortRef}
                                removePortRef={removePortRef}
                                key={vo.id}
                                data={vo}
                                onPortEvent={onPortEvent}
                                sandboxMode={sandboxMode}
                                lastPort={i === valueOutputs.length - 1}
                                onAddPort={onPortAdd}
                            />
                        ))}
                    </div>
                </div>
                <div className="flow flow-outputs">
                    {flowOutputs.map((fo, i) => (
                        <Port
                            getPortRef={getPortRef}
                            removePortRef={removePortRef}
                            key={fo.id}
                            data={fo}
                            onPortEvent={onPortEvent}
                            sandboxMode={sandboxMode}
                            onAddPort={onPortAdd}
                            lastPort={i === flowOutputs.length - 1}
                        />
                    ))}
                </div>
            </div>
        </Toolbar>
    );
};

export const SandboxNode: React.FC<INodeProps> = props => {
    const style: React.CSSProperties = {
        position: 'absolute',
        visibility: 'hidden', // hack for jitter
    };
    return React.cloneElement(<Node {...props} sandboxMode />, { style });
};
