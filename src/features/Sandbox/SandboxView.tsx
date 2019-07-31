import { DraggableTabPane, DraggableTabs } from 'components/DraggableTabs';
import { VerticalCollapsible } from 'components/VerticalCollapsible/VerticalCollapsible';
import { Observer, useObserver } from 'mobx-react-lite';
import React from 'react';
import {
    DragDropContext,
    DragUpdate,
    DropResult,
    ResponderProvided,
} from 'react-beautiful-dnd';
import { useStore } from 'stores';
import { NodeSelect } from './NodeSelect/NodeSelect';
import { SandboxCanvas } from './Sandbox/SandboxCanvas';
import './SandboxView.less';

export const SandboxView = () => {
    const { sandboxStore } = useStore();

    function onDragEnd(result: DropResult, provided: ResponderProvided) {
        console.log(result, provided);

        if (!result.destination) {
            return;
        }
    }

    function onDragUpdate(initial: DragUpdate, provided: ResponderProvided) {
        console.log(initial, provided);
    }

    return (
        <div className="sandbox-view-container">
            <DraggableTabs>
                <DraggableTabPane tab="Thing" tabId="0">
                    <DragDropContext
                        onDragEnd={onDragEnd}
                        onDragUpdate={onDragUpdate}
                    >
                        <Observer>
                            {() => (
                                <VerticalCollapsible
                                    width="10%"
                                    onTabClick={() =>
                                        sandboxStore.toggleNodeSelect()
                                    }
                                    tabContent="Nodes"
                                    collapsed={sandboxStore.nodeSelectClosed}
                                >
                                    <NodeSelect />
                                </VerticalCollapsible>
                            )}
                        </Observer>
                        <Observer>{() => <SandboxCanvas />}</Observer>
                        <Observer>
                            {() => (
                                <VerticalCollapsible
                                    onTabClick={() =>
                                        sandboxStore.toggleNodeInfo()
                                    }
                                    tabDirection="left"
                                    tabContent="Node Info"
                                    collapsed={sandboxStore.nodeInfoClosed}
                                >
                                    Hello I can collapse
                                </VerticalCollapsible>
                            )}
                        </Observer>
                    </DragDropContext>
                </DraggableTabPane>
            </DraggableTabs>
        </div>
    );
};
