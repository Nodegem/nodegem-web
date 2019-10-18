import { Button, Dropdown, Icon, Menu } from 'antd';
import { FlexFillGreedy, FlexRow } from 'components';
import { useStore } from 'overstated';
import React, { useMemo } from 'react';
import { SandboxHeaderStore } from './stores/sandbox-header-store';

const middleDelete = (event: MouseEvent, deleteTab: () => void) => {
    if (event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
        deleteTab();
    }
};

interface IBridgeMenuProps {
    bridges?: IBridgeInfo[];
    currentBridge?: IBridgeInfo;
    onSelect: (bridge: IBridgeInfo) => void;
    refresh: () => void;
}

const BridgeMenu: React.FC<IBridgeMenuProps> = ({
    bridges,
    currentBridge,
    onSelect,
    refresh,
}) =>
    useMemo(
        () => (
            <Menu theme="dark">
                {bridges &&
                    bridges.map(b => (
                        <Menu.Item
                            key={b.deviceIdentifier}
                            onClick={() => onSelect(b)}
                            disabled={
                                currentBridge &&
                                b.deviceIdentifier ===
                                    currentBridge.deviceIdentifier
                            }
                        >
                            {b.deviceName}
                        </Menu.Item>
                    ))}
                {!bridges && (
                    <Menu.Item key="none" disabled>
                        No Bridges
                    </Menu.Item>
                )}
                <Menu.Divider />
                <Menu.Item key="refresh" onClick={() => refresh()}>
                    <Icon type="sync" />
                    Refresh Bridges
                </Menu.Item>
            </Menu>
        ),
        [bridges, currentBridge]
    );

interface ISandboxHeaderProps {
    sandboxHeaderStore: SandboxHeaderStore;
}

export const SandboxHeader: React.FC<ISandboxHeaderProps> = ({
    sandboxHeaderStore,
}) => {
    const {
        canSave,
        isSavingGraph,
        saveGraph,
        canEdit,
        editGraph,
        isRunning,
        canRun,
        runGraph,
        canSelectBridge,
        hasBridge,
        bridges,
        onBridgeSelect,
        refreshBridges,
        bridge,
        loadingBridges,
    } = useStore(sandboxHeaderStore, store => ({
        canSave: store.canSave,
        saveGraph: store.ctx.saveGraph,
        canEdit: store.canEdit,
        editGraph: store.onEditGraph,
        canRun: store.canRun,
        runGraph: store.ctx.runGraph,
        canSelectBridge: store.canSelectBridge,
        hasBridge: store.hasBridgeSelected,
        onBridgeSelect: store.onBridgeSelect,
        refreshBridges: store.refreshBridges,
        ...store.state,
    }));

    return (
        <FlexRow className="sandbox-header" flex="0 1 auto">
            <FlexRow gap={5}>
                <Button
                    disabled={!canSave}
                    shape="round"
                    type="primary"
                    icon="save"
                    loading={isSavingGraph}
                    onClick={saveGraph}
                >
                    Save
                </Button>
                <Button
                    disabled={!canEdit}
                    shape="round"
                    type="primary"
                    icon="setting"
                    onClick={editGraph}
                >
                    Edit Graph
                </Button>
            </FlexRow>
            <FlexFillGreedy />
            <FlexRow gap={5}>
                <Button
                    type="primary"
                    shape="round"
                    icon="caret-right"
                    disabled={!canRun}
                    onClick={runGraph}
                    loading={isRunning}
                >
                    Run
                </Button>
                <Dropdown
                    disabled={!canSelectBridge}
                    overlay={
                        <BridgeMenu
                            onSelect={onBridgeSelect}
                            bridges={bridges}
                            currentBridge={bridge}
                            refresh={refreshBridges}
                        />
                    }
                >
                    <Button
                        type="primary"
                        shape="round"
                        icon="deployment-unit"
                        loading={loadingBridges}
                    >
                        {!hasBridge ? 'Bridge(s)' : bridge!.deviceName}
                        <Icon type="down" />
                    </Button>
                </Dropdown>
            </FlexRow>
        </FlexRow>
    );
};
