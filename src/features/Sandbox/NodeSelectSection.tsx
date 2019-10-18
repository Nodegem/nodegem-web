import { CustomCollapsible } from 'components';
import React from 'react';
import { NodeSelect } from './NodeSelect';

interface INodeSelectProps {
    open: boolean;
    addNode: (definition: NodeDefinition) => void;
    isLoadingDefinitions: boolean;
    nodeOptions: NodeCache;
}

export const NodeSelectSection: React.FC<INodeSelectProps> = ({
    open,
    addNode,
    isLoadingDefinitions,
    nodeOptions,
}) => {
    return (
        <CustomCollapsible
            size="15vw"
            minSize="325px"
            onTabClick={() => {}}
            tabContent="Nodes"
            collapsed={!open && !!nodeOptions}
        >
            <NodeSelect
                onFilter={text => {}}
                addNode={addNode}
                loading={isLoadingDefinitions}
                nodeOptions={nodeOptions.selectFriendly}
            />
        </CustomCollapsible>
    );
};
