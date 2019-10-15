import { Icon } from 'antd';
import classNames from 'classnames';
import { DraggableTabs, FlexRow, ITab } from 'components';
import React from 'react';

const middleDelete = (event: MouseEvent, deleteTab: () => void) => {
    if (event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
        deleteTab();
    }
};

const TabTemplate: React.FC<
    ITab & { deleteTab: (tabId: string) => void; isDragging: boolean }
> = ({ name, id, isDragging, deleteTab }) => {
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
};

export const GraphTabsSection = () => {
    return (
        <FlexRow className="graph-tabs" flex="0 1 auto">
            {/* <DraggableTabs
                tabs={sandboxStore.tabManager.tabs.map(t => ({
                    id: t.graph.id!,
                    name: t.graph.name!,
                    data: t,
                }))}
                activeTab={
                    sandboxStore.tabManager.activeTab &&
                    sandboxStore.tabManager.activeTab.graph.id
                }
                onTabReorder={handleTabReorder}
                dragEndObservable={sandboxStore.dragEndObservable}
                onTabAdd={() =>
                    sandboxStore.stateManager.toggleModalState('initialPrompt')
                }
                onTabClick={handleTabClick}
                tabTemplate={(tab, isDragging) => (
                    <TabTemplate
                        {...tab}
                        isDragging={isDragging}
                        deleteTab={sandboxStore.tabManager.deleteTab}
                    />
                )}
            /> */}
        </FlexRow>
    );
};
