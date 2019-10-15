import { CustomCollapsible } from 'components';
import React from 'react';
import NodeInfo from './NodeInfo/NodeInfo';

export const NodeInfoSection = () => {
    // const { isOpen, toggle } = nodeInfo;

    return (
        <CustomCollapsible
            size="18vw"
            minSize="325px"
            onTabClick={() => {}}
            direction="left"
            tabContent="Node Info"
            collapsed={false}
        >
            <NodeInfo
                // selectedNode={sandboxStore.sandboxManager.firstSelectedNode}
                selectedNode={undefined}
                onNodeValueChange={(n, f) => n.updatePortValues(f)}
            />
        </CustomCollapsible>
    );
};
