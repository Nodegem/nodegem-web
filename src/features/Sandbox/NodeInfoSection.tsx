import { CustomCollapsible } from 'components';
import React from 'react';
import NodeInfo from './NodeInfo/NodeInfo';

interface INodeInfoProps {
    open: boolean;
}

export const NodeInfoSection: React.FC<INodeInfoProps> = ({ open }) => {
    return (
        <CustomCollapsible
            size="18vw"
            minSize="325px"
            onTabClick={() => {}}
            direction="left"
            tabContent="Node Info"
            collapsed={!open}
        >
            <NodeInfo
                // selectedNode={sandboxStore.sandboxManager.firstSelectedNode}
                selectedNode={undefined}
                onNodeValueChange={(n, f) => n.updatePortValues(f)}
            />
        </CustomCollapsible>
    );
};
