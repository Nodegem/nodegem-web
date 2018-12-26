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
}: ControlProps) => {
    const controlClasses = classNames({
        control: true,
        'control--disabled': running || !connected,
    });

    const playTooltip = !running ? 'Play' : 'Running';
    const playIcon = running ? 'loading' : 'play-circle';
    return (
        <div className="control-panel">
            <ul className="graph-options">
                <li>
                    <Button
                        onClick={saveGraph}
                        size="small"
                        type="primary"
                        loading={saving}
                    >
                        Save Graph
                    </Button>
                </li>
                <li>
                    <Button onClick={clearGraph} size="small" type="primary">
                        Clear Graph
                    </Button>
                </li>
                <li>
                    <Button onClick={newMacro} size="small" type="primary">
                        New Macro
                    </Button>
                </li>
            </ul>
            <ul className="graph-controls">
                <li className={controlClasses} onClick={runGraph}>
                    <Tooltip title={playTooltip}>
                        <Icon type={playIcon} style={{ fontSize: '24px' }} />
                    </Tooltip>
                </li>
                <li onClick={showLogDrawer}>
                    <Tooltip title="View Logs" placement="bottom">
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
