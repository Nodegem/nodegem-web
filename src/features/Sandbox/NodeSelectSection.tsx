import { CustomCollapsible } from 'components';
import React from 'react';
import { NodeSelect } from './NodeSelect';

interface INodeSelectProps {
    open: boolean;
}

export const NodeSelectSection: React.FC<INodeSelectProps> = ({ open }) => {
    return (
        <CustomCollapsible
            size="15vw"
            minSize="325px"
            onTabClick={() => {}}
            tabContent="Nodes"
            collapsed={!open}
        >
            <NodeSelect
                // onFilter={text =>
                //     sandboxStore.searchManager.setNodeOptionSearchtext(text)
                // }
                onFilter={text => {}}
                // addNode={node => sandboxStore.addNode(node.fullName)}
                addNode={node => {}}
                loading={
                    false
                    // sandboxStore.stateManager.sandboxState.loadingDefinitions
                }
                nodeOptions={{} as any}
                //     sandboxStore.stateManager.nodeDefinitions &&
                //     sandboxStore.stateManager.nodeDefinitions.selectFriendly
                // }
            />
        </CustomCollapsible>
    );
};
