import './Log.less';

import classNames from 'classnames';
import { observer } from 'mobx-react';
import * as moment from 'moment';
import * as React from 'react';

import { IReactionDisposer, reaction } from 'mobx';
import { Log } from '../editor-store';

interface ILogViewProps {
    maxLogsDisplayed?: number;
    logs: Log[];
}

@observer
class LogView extends React.Component<ILogViewProps, { logCount: number }> {
    public static defaultProps = {
        maxLogsDisplayed: 250,
    };

    private logContainer: HTMLElement;
    private disposer: IReactionDisposer;

    public state = {
        logCount: 0,
    };

    public componentDidMount() {
        this.disposer = reaction(
            () => {
                return this.state.logCount !== this.props.logs.length;
            },
            () => {
                this.setState({ logCount: this.props.logs.length }, () =>
                    this.scrollToBottom()
                );
            }
        );
    }

    public scrollToBottom() {
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    public componentWillUnmount() {
        this.disposer();
    }

    public render() {
        let { logs } = this.props;
        const { maxLogsDisplayed } = this.props;

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
        );
    }
}

export default LogView;
