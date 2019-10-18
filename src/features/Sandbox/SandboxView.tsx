import { FlexColumn, FlexRow } from 'components';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { GraphTabsSection } from './GraphTabsSection';
import { NodeInfoSection } from './NodeInfoSection';
import { NodeSelectSection } from './NodeSelectSection';
import { SandboxCanvas } from './Sandbox/SandboxCanvas';

import { useStore } from 'overstated';
import { IntroPrompts } from './IntroPrompts';
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
    } = useStore(SandboxStore, app => ({
        sandboxStore: app,
        sandboxHeaderStore: app.sandboxHeaderStore,
        canvasStore: app.canvasStore,
        introStore: app.introStore,
        tabsStore: app.tabsStore,
        nodeInfoStore: app.nodeInfoStore,
        nodeSelectStore: app.nodeSelectStore,
    }));

    useEffect(() => {
        sandboxStore.registerEvents();
        sandboxStore.initialize();
        return () => {
            sandboxStore.dispose();
        };
    }, []);

    return (
        <>
            <FlexColumn className="sandbox-view-container">
                <SandboxHeader sandboxHeaderStore={sandboxHeaderStore} />
                <DragDropContext onDragEnd={canvasStore.onCanvasDrag}>
                    <FlexRow className="graph-content">
                        <NodeSelectSection nodeSelectStore={nodeSelectStore} />
                        <FlexColumn flex="1 1 0%" style={{ minWidth: 0 }}>
                            <GraphTabsSection tabsStore={tabsStore} />
                            <SandboxCanvas canvasStore={canvasStore} />
                        </FlexColumn>
                        <NodeInfoSection nodeInfoStore={nodeInfoStore} />
                    </FlexRow>
                </DragDropContext>
            </FlexColumn>
            <IntroPrompts introStore={introStore} />
        </>
    );
};
