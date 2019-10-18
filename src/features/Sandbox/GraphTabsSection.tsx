import { Icon } from 'antd';
import classNames from 'classnames';
import { DraggableTabs, FlexRow, ITab } from 'components';
import { useStore } from 'overstated';
import React, { useCallback, useMemo } from 'react';
import { TabsStore } from './stores/tabs-store';

const middleDelete = (event: MouseEvent, deleteTab: () => void) => {
    if (event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
        deleteTab();
    }
};

const TabTemplate: React.FC<
    ITab & { deleteTab: (tabId: string) => void; isDragging: boolean }
> = React.memo(({ name, id, isDragging, deleteTab }) => {
    return (
        <div
            className={classNames({ tab: true, dragging: isDragging })}
            onMouseDown={event =>
                middleDelete(event.nativeEvent, () => deleteTab(id))
            }
        >
            <span className="tab-title">{name}</span>
            <span className="tab-close" onMouseDown={() => deleteTab(id)}>
                <Icon type="close" />
            </span>
        </div>
    );
});

interface IGraphTabsProps {
    tabsStore: TabsStore;
}

export const GraphTabsSection: React.FC<IGraphTabsProps> = ({ tabsStore }) => {
    const {
        tabs,
        activeTab,
        setTabs,
        addTabPrompt,
        setActiveTab,
        removeTab,
    } = useStore(tabsStore, store => ({
        tabs: store.state.tabs,
        activeTab: store.activeTab,
        setTabs: store.setTabs,
        addTabPrompt: store.openIntroPrompt,
        setActiveTab: store.setActiveTab,
        removeTab: store.removeTab,
    }));

    const tabReorder = useCallback(
        (orderedTabs: ITab[]) => setTabs(orderedTabs.map(t => t.data)),
        []
    );
    return (
        <FlexRow className="graph-tabs" flex="0 1 auto">
            <DraggableTabs
                tabs={tabs.map(t => ({
                    id: t.graph.id!,
                    name: t.graph.name!,
                    data: t,
                }))}
                activeTab={activeTab && activeTab.graph.id}
                onTabReorder={tabReorder}
                onTabAdd={addTabPrompt}
                onTabClick={setActiveTab}
                tabTemplate={(tab, isDragging) => (
                    <TabTemplate
                        {...tab}
                        isDragging={isDragging}
                        deleteTab={removeTab}
                    />
                )}
            />
        </FlexRow>
    );
};
