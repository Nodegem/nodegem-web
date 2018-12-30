import * as React from 'react';
import classNames from 'classnames';
import { Button, Tooltip, Icon } from 'antd';

type ControlProps = {
    running: boolean;
    connected: boolean;
    saving: boolean;
    saveGraph: () => void;
    clearGraph: () => void;
    runGraph: () => void;
    editGraph: () => void;
    newMacro: () => void;
    showLogDrawer: () => void;
};

export const ControlPanelView = ({
    running,
    connected,
    saving,
    saveGraph,
    clearGraph,
    newMacro,
    runGraph,
    showLogDrawer,
    editGraph,
}: ControlProps) => {
    const controlClasses = classNames({
        control: true,
        'control--disabled': running || !connected,
    });

    const playTooltip = !running ? 'Run' : 'Running';
    const playIcon = running ? 'loading' : 'play-circle';

    const buttons = [
        {
            click: editGraph,
            icon: 'edit',
            loading: false,
            toolTip: 'Edit',
        },
        {
            click: saveGraph,
            icon: 'save',
            loading: saving,
            toolTip: 'Save',
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
                        <Icon type={playIcon} style={{ fontSize: '24px' }} />
                    </Tooltip>
                </li>
                <li onClick={showLogDrawer}>
                    <Tooltip title="Logs" placement="bottom">
                        <Icon
                            className={controlClasses}
                            type="code"
                            style={{ fontSize: '24px' }}
                        />
                    </Tooltip>
                </li>
            </ul>
        </div>
    );
};
