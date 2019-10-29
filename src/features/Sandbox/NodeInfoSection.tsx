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
    const { isOpen, selectedNode, updatePortData, toggle } = useStore(
        nodeInfoStore,
        store => ({
            toggle: store.toggleOpen,
            updatePortData: store.updatePortData,
            ...store.state,
        })
    );

    return (
        <CustomCollapsible
            size="375px"
            onTabClick={() => toggle()}
            direction="left"
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
                    onNodeValueChange={updatePortData}
                />
            )}
        </CustomCollapsible>
    );
};
