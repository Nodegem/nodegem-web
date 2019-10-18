import { Badge, Button, Icon, Input, Spin } from 'antd';
import classNames from 'classnames';
import { Loader } from 'components';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Link } from '../Link/Link';
import LinkController from '../Link/link-controller';
import { Node } from '../Node';
import NodeController from '../Node/node-controller';
import { GraphStore } from '../stores';
import SandboxManager from './sandbox-manager';
import './SandboxCanvas.less';

export const sandboxDroppableId = 'sandboxId';

const SandboxDropContainer = React.memo(() => (
    <Droppable droppableId={sandboxDroppableId}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                className="droppable-area"
                {...provided.droppableProps}
                style={{ width: '100%', height: '100%' }}
            >
                {provided.placeholder}
            </div>
        )}
    </Droppable>
));

export interface ISandboxProps {
    graphStore: GraphStore;
    toggleConsole: () => void;
    canToggleConsole?: boolean;
    isConsoleLoading: boolean;
    loading: boolean;
    isActive?: boolean;
    hasUnread?: boolean;
    nodes: NodeController[];
    links: LinkController[];
    size?: { width: number; height: number };
    visibleLinks?: boolean;
    isDrawing?: boolean;
}

export const SandboxCanvas: React.FC<ISandboxProps> = ({
    loading,
    graphStore,
    isActive,
    toggleConsole,
    canToggleConsole,
    isConsoleLoading,
    hasUnread,
    nodes = [],
    links = [],
    visibleLinks = true,
    isDrawing,
    size = { width: 12000, height: 12000 },
}: ISandboxProps) => {
    const canvasRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvasElement = canvasRef.current!;
        graphStore.bindElement(canvasElement, size);
    }, [graphStore]);

    const onEditNode = useCallback(
        () => graphStore.ctx.panelStore.toggleNodeInfo(),
        []
    );

    const toggleConsoleCallback = useCallback(() => toggleConsole(), []);

    return useMemo(
        () => (
            <div
                className={classNames({
                    sandbox: true,
                    disabled: loading || !isActive,
                })}
            >
                {loading && <Loader size={9} />}
                <SandboxDropContainer />
                <div
                    className={classNames({ canvas: true, loading })}
                    ref={canvasRef}
                >
                    <div className="links" style={{ position: 'absolute' }}>
                        {links.map(l => (
                            <Link
                                key={l.id}
                                type={l.type}
                                visible={visibleLinks}
                                getRef={l.getElementRef}
                            />
                        ))}
                        {/* <Link
                        visible={!!isDrawing}
                        type={linkType!}
                        getRef={getDrawLinkRef}
                    /> */}
                    </div>
                    <div className="nodes">
                        {nodes.map(n => (
                            <Node
                                key={n.id}
                                getRef={n.getElementRef}
                                getPortRef={n.getPortRef}
                                removePortRef={n.removePortRef}
                                onPortEvent={n.onPortEvent}
                                data={n.nodeData}
                                editNode={onEditNode}
                                removeNode={graphStore.removeNode}
                                onPortAdd={n.addPort}
                                onPortRemove={n.removePort}
                                hidePortActions={false}
                            />
                        ))}
                    </div>
                </div>
                <div className="footer bottom-left-footer">
                    <Input
                        prefix={<Icon type="search" />}
                        onChange={event => {}}
                        allowClear
                        placeholder="Search Nodes"
                    />
                    <Badge count={hasUnread ? 1 : 0} dot>
                        <Button
                            disabled={canToggleConsole}
                            shape="circle"
                            type="primary"
                            icon="code"
                            loading={isConsoleLoading}
                            onClick={toggleConsoleCallback}
                        />
                    </Badge>
                </div>
                <div className="footer bottom-right-footer">
                    <Button
                        type="primary"
                        shape="circle"
                        icon="minus"
                        // onClick={() => sandboxManager.magnify(-0.15)}
                    />
                    <Button
                        type="primary"
                        shape="circle"
                        icon="block"
                        // onClick={sandboxManager.resetView}
                    />
                    <Button
                        type="primary"
                        shape="circle"
                        icon="plus"
                        // onClick={() => sandboxManager.magnify(0.15)}
                    />
                </div>
            </div>
        ),
        [
            loading,
            isDrawing,
            visibleLinks,
            hasUnread,
            isConsoleLoading,
            links,
            nodes,
        ]
    );
};
