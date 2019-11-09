import { Button, Checkbox, Dropdown, Icon, Menu, Tooltip } from 'antd';
import { FlexFillGreedy, FlexRow } from 'components';
import { useStore } from 'overstated';
import React, { useMemo } from 'react';
import { isMacro } from 'utils';
import { SandboxHeaderStore } from './stores/sandbox-header-store';

interface IBridgeMenuProps {
    bridges: IBridgeInfo[];
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
            <Menu theme="dark" className="bridge-menu" selectable={false}>
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
                {!bridges.any() && (
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

interface ISettingsMenuProps {
    autosaveGraph: boolean;
    autosaveNode: boolean;
    autoSaveGraphToggle: (value?: boolean) => void;
    autoSaveNodeToggle: (value?: boolean) => void;
}

const SettingsMenu: React.FC<ISettingsMenuProps> = ({
    autosaveNode,
    autosaveGraph,
    autoSaveGraphToggle,
    autoSaveNodeToggle,
}) => (
    <Menu theme="dark" className="sandbox-settings-menu" selectable={false}>
        <Menu.Item>
            <Checkbox
                checked={autosaveGraph}
                onChange={value => autoSaveGraphToggle(value.target.checked)}
            >
                Auto Save Graph
                <Tooltip title="Save graph changes automatically">
                    <Icon type="info-circle" />
                </Tooltip>
            </Checkbox>
        </Menu.Item>
        <Menu.Item>
            <Checkbox
                checked={autosaveNode}
                onChange={value => autoSaveNodeToggle(value.target.checked)}
            >
                Auto Save Node
                <Tooltip title="Save node changes automatically">
                    <Icon type="info-circle" />
                </Tooltip>
            </Checkbox>
        </Menu.Item>
    </Menu>
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
        connected,
        connecting,
        runGraph,
        hasBridge,
        bridges,
        onBridgeSelect,
        refreshBridges,
        bridge,
        loadingBridges,
        activeTab,
        toggleMacroRunModal,
        autoSaveGraph,
        autoSaveNode,
        toggleAutosaveGraph,
        toggleAutosaveNode,
    } = useStore(sandboxHeaderStore, store => ({
        saveGraph: store.ctx.saveGraph,
        editGraph: store.onEditGraph,
        runGraph: store.runGraph,
        hasBridge: store.hasSelectedBridge,
        onBridgeSelect: store.onBridgeSelect,
        refreshBridges: store.refreshBridges,
        activeTab: store.ctx.tabsStore.activeTab,
        toggleMacroRunModal: store.ctx.introStore.toggleMacroRunModal,
        toggleAutosaveGraph: store.toggleAutosaveGraph,
        toggleAutosaveNode: store.toggleAutosaveNode,
        ...store.state,
    }));

    return (
        <FlexRow className="sandbox-header" flex="0 1 auto">
            <FlexRow gap={10}>
                <Dropdown
                    overlay={
                        <SettingsMenu
                            autosaveGraph={autoSaveGraph}
                            autosaveNode={autoSaveNode}
                            autoSaveGraphToggle={toggleAutosaveGraph}
                            autoSaveNodeToggle={toggleAutosaveNode}
                        />
                    }
                >
                    <Button
                        type="primary"
                        icon="tool"
                        style={{ marginRight: '10px' }}
                    >
                        Settings
                        <Icon type="down" />
                    </Button>
                </Dropdown>
                <Button
                    disabled={!canEdit}
                    type="primary"
                    icon="setting"
                    onClick={editGraph}
                >
                    Edit Graph
                </Button>
                <Button
                    disabled={!canSave}
                    type="primary"
                    icon="save"
                    loading={isSavingGraph}
                    onClick={saveGraph}
                >
                    Save
                </Button>
            </FlexRow>
            <FlexFillGreedy />
            <FlexRow gap={10}>
                <Button
                    type="primary"
                    icon="caret-right"
                    disabled={!connected}
                    onClick={() => {
                        if (activeTab && isMacro(activeTab.graph)) {
                            toggleMacroRunModal(true);
                        } else {
                            runGraph();
                        }
                    }}
                    loading={connecting}
                >
                    Run
                </Button>
                <Dropdown
                    disabled={!connected}
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
