import { Empty } from 'antd';
import { CustomCollapsible } from 'components';
import { useStore } from 'overstated';
import React from 'react';
import { NodeSelect } from './NodeSelect';
import { NodeSelectStore } from './stores/node-select-store';

interface INodeSelectProps {
    nodeSelectStore: NodeSelectStore;
}

export const NodeSelectSection: React.FC<INodeSelectProps> = ({
    nodeSelectStore,
}) => {
    const { isOpen, nodeOptions, isLoadingDefinitions, addNode } = useStore(
        nodeSelectStore,
        store => ({
            addNode: store.addNode,
            ...store.state,
        })
    );

    return (
        <CustomCollapsible
            size="15vw"
            minSize="325px"
            onTabClick={() => {}}
            tabContent="Nodes"
            collapsed={!isOpen}
            className="node-select-collapsible"
        >
            {!nodeOptions ||
                (!nodeOptions.selectFriendly && (
                    <Empty description="Please create or open a graph to view nodes" />
                ))}
            {nodeOptions && nodeOptions.selectFriendly && (
                <NodeSelect
                    onFilter={text => {}}
                    addNode={addNode}
                    loading={isLoadingDefinitions}
                    nodeOptions={nodeOptions.selectFriendly}
                />
            )}
        </CustomCollapsible>
    );
};
