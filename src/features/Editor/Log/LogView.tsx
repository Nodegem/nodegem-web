import './LogView.less';

import classNames from 'classnames';
import { inject, observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';

import { Button } from 'antd';
import { IReactionDisposer, reaction } from 'mobx';
import { EditorStore, ILog } from '../editor-store';

interface ILogViewProps {
    maxLogsDisplayed?: number;
    logs: ILog[];
    editorStore?: EditorStore;
}

@inject('editorStore')
@observer
class LogView extends React.Component<ILogViewProps> {
    public static defaultProps = {
        maxLogsDisplayed: 250,
    };

    private onClearLogs = () => {
        this.props.editorStore!.clearLogs();
    };

    public render() {
        let { logs } = this.props;
        const { maxLogsDisplayed } = this.props;

        const logCount = logs.length;
        if (logCount > maxLogsDisplayed!) {
            logs = logs.slice(Math.max(logs.length - maxLogsDisplayed!, 1));
        }

        logs = logs.reverse();
        return (
            <>
                <Button
                    type="danger"
                    icon="delete"
                    size="small"
                    onClick={this.onClearLogs}
                    className="clear-log"
                >
                    Clear Logs
                </Button>
                <div className="log-container">
                    {logs.map((l, index) => {
                        const logType = l.type;
                        const logClass = classNames({
                            log: logType === 'log',
                            'log-debug': logType === 'debug',
                            'log-warn': logType === 'warn',
                            'log-error': logType === 'error',
                        });

                        const prefix =
                            logType === 'warn'
                                ? '[WARN]'
                                : logType === 'error'
                                ? '[ERROR]'
                                : logType === 'debug'
                                ? '[DEBUG]'
                                : '[LOG]';

                        return (
                            <div key={index} className="log-line">
                                <span className={logClass}>
                                    {`${moment(l.time).format(
                                        'MM-DD-YYYY kk:mm:ss'
                                    )} ${prefix}: ${l.message}`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    }
}

export default LogView;
