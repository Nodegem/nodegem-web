import './Log.less';

import classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';

import { Log } from '../editor-store';
import { observer } from 'mobx-react';

interface LogViewProps {
    maxLogsDisplayed?: number;
    logs: Array<Log>;
}

@observer
class LogView extends React.Component<LogViewProps> {
    static defaultProps = {
        maxLogsDisplayed: 250,
    };

    private logContainer: HTMLElement;

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    public render() {
        let { logs, maxLogsDisplayed } = this.props;

        const logCount = logs.length;
        if (logCount > maxLogsDisplayed!) {
            logs = logs.slice(Math.max(logs.length - maxLogsDisplayed!, 1));
        }

        return (
            <div className="log-container" ref={r => (this.logContainer = r!)}>
                {logs.map((l, index) => {
                    const logType = l.type;
                    const logClass = classNames({
                        log: logType === 'log',
                        'log-warn': logType === 'warn',
                        'log-error': logType === 'error',
                    });

                    const prefix =
                        logType === 'warn'
                            ? '[WARN]'
                            : logType === 'error'
                            ? '[ERROR]'
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
        );
    }
}

export default LogView;
