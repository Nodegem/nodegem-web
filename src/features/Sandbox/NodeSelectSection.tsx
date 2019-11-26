import { Empty } from 'antd';
import { CustomCollapsible } from 'components';
import { useStore } from 'overstated';
import React from 'react';
import { NodeSelect } from './NodeSelect';
import { NodeSelectStore } from './stores/node-select-store';
import _ from 'lodash';

interface INodeSelectProps {
    nodeSelectStore: NodeSelectStore;
}

export const NodeSelectSection: React.FC<INodeSelectProps> = ({
    nodeSelectStore,
}) => {
    const {
        isOpen,
        isLoadingDefinitions,
        toggle,
        addNode,
        setInputRef,
    } = useStore(nodeSelectStore, store => ({
        toggle: store.toggleOpen,
        addNode: store.addNode,
        setInputRef: store.setInputRef,
        ...store.state,
    }));

    const { handleSearchChange, options } = useStore(
        nodeSelectStore.nodeSelectionSearchStore,
        store => ({
            handleSearchChange: store.handleSearchChange,
            ...store.state,
        })
    );

    return (
        <CustomCollapsible
            size="340px"
            onTabClick={toggle}
            collapsed={!isOpen}
            className="node-select-collapsible"
        >
            {!options ||
                (!options.selectFriendly && (
                    <Empty description="Please create or open a graph to view nodes" />
                ))}
            {options && options.selectFriendly && (
                <NodeSelect
                    setInputRef={setInputRef}
                    onFilter={_.debounce(handleSearchChange, 150)}
                    addNode={addNode}
                    loading={isLoadingDefinitions}
                    nodeOptions={options.selectFriendly}
                />
            )}
        </CustomCollapsible>
    );
};
