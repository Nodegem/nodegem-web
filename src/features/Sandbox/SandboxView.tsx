import { FlexColumn, FlexRow } from 'components';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { Canvas } from './Canvas';
import { GraphTabsSection } from './GraphTabsSection';
import { NodeInfoSection } from './NodeInfoSection';
import { NodeSelectSection } from './NodeSelectSection';

import { Button, Empty } from 'antd';
import { useStore } from 'overstated';
import MediaQuery, { useMediaQuery } from 'react-responsive';
import routerHistory from 'utils/history';
import { IntroPrompts } from './IntroPrompts';
import { LogsView } from './LogView';
import { SandboxHeader } from './SandboxHeader';
import './SandboxView.less';
import { SandboxStore } from './stores';

export const SandboxView = () => {
    const {
        sandboxStore,
        sandboxHeaderStore,
        canvasStore,
        introStore,
        tabsStore,
        nodeInfoStore,
        nodeSelectStore,
        isLoading,
        logsStore,
        hasUnreadLogs,
    } = useStore(SandboxStore, app => ({
        sandboxStore: app,
        sandboxHeaderStore: app.sandboxHeaderStore,
        canvasStore: app.canvasStore,
        introStore: app.introStore,
        tabsStore: app.tabsStore,
        nodeInfoStore: app.nodeInfoStore,
        nodeSelectStore: app.nodeSelectStore,
        isLoading: app.state.isLoading,
        logsStore: app.logsStore,
        hasUnreadLogs: app.tabsStore.state.hasUnread,
    }));

    const isDesktop = useMediaQuery({
        query: '(min-device-width: 1024px)',
    });

    useEffect(() => {
        if (isDesktop) {
            sandboxStore.registerEvents();
            sandboxStore.initialize();
        }
        const unregister = routerHistory.listen((location, action) => {
            sandboxStore.saveStateLocally();
        });

        return () => {
            sandboxStore.dispose();
            unregister();
        };
    }, [isDesktop]);

    return (
        <>
            <MediaQuery minDeviceWidth={1024}>
                <FlexColumn className="sandbox-view-container">
                    <SandboxHeader sandboxHeaderStore={sandboxHeaderStore} />
                    <DragDropContext onDragEnd={canvasStore.onCanvasDrag}>
                        <FlexRow className="graph-content">
                            <NodeSelectSection
                                nodeSelectStore={nodeSelectStore}
                            />
                            <FlexColumn flex="1 1 0%" style={{ minWidth: 0 }}>
                                <GraphTabsSection tabsStore={tabsStore} />
                                <Canvas
                                    canvasStore={canvasStore}
                                    isLoading={isLoading}
                                    hasUnreadLogs={hasUnreadLogs}
                                />
                            </FlexColumn>
                            <NodeInfoSection nodeInfoStore={nodeInfoStore} />
                        </FlexRow>
                    </DragDropContext>
                </FlexColumn>
                <IntroPrompts introStore={introStore} />
                <LogsView logStore={logsStore} />
            </MediaQuery>
            <MediaQuery maxDeviceWidth={1023}>
                <div className="mobile-restriction">
                    <Empty
                        image="https://42f2671d685f51e10fc6-b9fcecea3e50b3b59bdc28dead054ebc.ssl.cf5.rackcdn.com/illustrations/chore_list_iof3.svg"
                        description="Sandbox only supports higher resolution devices but we do hope to support mobile soon. Sorry for the inconvenience!"
                    >
                        <Button
                            type="primary"
                            onClick={() => routerHistory.goBack()}
                            icon="arrow-left"
                        >
                            Go Back
                        </Button>
                    </Empty>
                </div>
            </MediaQuery>
        </>
    );
};
