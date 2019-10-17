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
    tabs: TabData[];
    activeTab: TabData;
    deleteTab: (id: string) => void;
    onTabAdd: () => void;
    onTabClick: (id: string) => void;
    onTabReorder: (tabs: ITab[]) => void;
}

export const GraphTabsSection: React.FC<IGraphTabsProps> = ({
    tabs,
    activeTab,
    deleteTab,
    onTabAdd,
    onTabClick,
    onTabReorder,
}) => {
    return (
        <FlexRow className="graph-tabs" flex="0 1 auto">
            <DraggableTabs
                tabs={tabs.map(t => ({
                    id: t.graph.id!,
                    name: t.graph.name!,
                    data: t,
                }))}
                activeTab={activeTab && activeTab.graph.id}
                onTabReorder={onTabReorder}
                onTabAdd={onTabAdd}
                onTabClick={onTabClick}
                tabTemplate={(tab, isDragging) => (
                    <TabTemplate
                        {...tab}
                        isDragging={isDragging}
                        deleteTab={deleteTab}
                    />
                )}
            />
        </FlexRow>
    );
};
