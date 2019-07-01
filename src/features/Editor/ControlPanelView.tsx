import { Button, Checkbox, Icon, Tooltip } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import classNames from 'classnames';
import * as React from 'react';

interface IControlProps {
    running: boolean;
    debugEnabled: boolean;
    connected: boolean;
    saving: boolean;
    saveGraph: () => void;
    clearGraph: () => void;
    runGraph: () => void;
    editGraph: () => void;
    newMacro: () => void;
    showLogDrawer: () => void;
    onDebugModeChanged: (checked: boolean) => void;
}

export const ControlPanelView = ({
    running,
    debugEnabled,
    connected,
    saving,
    saveGraph,
    clearGraph,
    newMacro,
    runGraph,
    showLogDrawer,
    editGraph,
    onDebugModeChanged,
}: IControlProps) => {
    const controlClasses = classNames({
        control: true,
        'control--disabled': running || !connected,
    });

    const playTooltip = !running ? 'Run' : 'Running';
    const playIcon = running ? 'loading' : 'play-circle';

    const buttons = [
        {
            click: saveGraph,
            icon: 'save',
            loading: saving,
            toolTip: 'Save',
        },
        {
            click: editGraph,
            icon: 'edit',
            loading: false,
            toolTip: 'Edit',
        },
        {
            click: clearGraph,
            icon: 'delete',
            loading: false,
            toolTip: 'Clear',
        },
        {
            click: newMacro,
            icon: 'plus',
            loading: false,
            toolTip: 'Create Macro',
        },
    ];

    return (
        <div className="control-panel">
            <ul className="graph-options">
                {buttons.map((b, index) => (
                    <li key={index}>
                        <Tooltip title={b.toolTip}>
                            <Button
                                shape="circle"
                                type="primary"
                                onClick={b.click}
                                loading={b.loading}
                                icon={b.icon}
                            />
                        </Tooltip>
                    </li>
                ))}
            </ul>
            <ul className="graph-controls">
                <li className={controlClasses} onClick={runGraph}>
                    <Tooltip title={playTooltip}>
                        <Icon type={playIcon} style={{ fontSize: 24 }} />
                    </Tooltip>
                </li>
                <li onClick={showLogDrawer} className={controlClasses}>
                    <Tooltip title="Logs" placement="bottom">
                        <Icon type="code" style={{ fontSize: 24 }} />
                    </Tooltip>
                </li>
                <li className={controlClasses}>
                    <Tooltip title="Debug Mode">
                        <Checkbox
                            checked={debugEnabled}
                            onChange={(e: CheckboxChangeEvent) =>
                                onDebugModeChanged(e.target.checked)
                            }
                        />
                    </Tooltip>
                </li>
            </ul>
        </div>
    );
};
