import { Empty } from 'antd';
import { CustomCollapsible } from 'components';
import { useStore } from 'overstated';
import React from 'react';
import NodeInfo from './NodeInfo/NodeInfo';
import { NodeInfoStore } from './stores/node-info-store';

interface INodeInfoProps {
    nodeInfoStore: NodeInfoStore;
}

export const NodeInfoSection: React.FC<INodeInfoProps> = ({
    nodeInfoStore,
}) => {
    const { isOpen, selectedNode } = useStore(nodeInfoStore, store => ({
        ...store.state,
    }));

    return (
        <CustomCollapsible
            size="18vw"
            minSize="325px"
            onTabClick={() => {}}
            direction="left"
            tabContent="Node Info"
            collapsed={!isOpen}
            className="node-info-collapsible"
        >
            {!selectedNode && (
                <Empty
                    description="Select a Node"
                    style={{ alignItems: 'center' }}
                />
            )}

            {selectedNode && (
                <NodeInfo
                    selectedNode={selectedNode}
                    onNodeValueChange={(n, f) => {}}
                />
            )}
        </CustomCollapsible>
    );
};
