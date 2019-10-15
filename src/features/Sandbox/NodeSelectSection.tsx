import { CustomCollapsible } from 'components';
import React from 'react';
import { NodeSelect } from './NodeSelect';

export const NodeSelectSection = () => {
    return (
        <CustomCollapsible
            size="15vw"
            minSize="325px"
            onTabClick={() => {}}
            tabContent="Nodes"
            collapsed={true}
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
