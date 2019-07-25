import { Tabs } from 'antd';
import DraggableTabs from 'components/DraggableTabs/DraggableTabs';
import React, { useState } from 'react';
const { TabPane } = Tabs;

export const SandboxView: React.FC = () => {
    return (
        <DraggableTabs type="editable-card">
            <TabPane tab="tab 1" key="1">
                Content of Tab Pane 1
            </TabPane>
            <TabPane tab="tab 2" key="2">
                Content of Tab Pane 2
            </TabPane>
            <TabPane tab="tab 3" key="3">
                Content of Tab Pane 3
            </TabPane>
        </DraggableTabs>
    );
};
