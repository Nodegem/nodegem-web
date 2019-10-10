import classNames from 'classnames';
import { FlexColumn, FlexRow } from 'components';
import moment from 'moment';
import React from 'react';

import JSONTree from 'react-json-tree';

import { isJSON } from 'utils';
import './LogView.less';

interface ILogLineProps {
    log: LogData;
}

const theme = {
    scheme: 'monokai',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#272822',
    base01: '#383830',
    base02: '#49483e',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',
    base07: '#f9f8f5',
    base08: '#f92672',
    base09: '#fd971f',
    base0A: '#f4bf75',
    base0B: '#a6e22e',
    base0C: '#a1efe4',
    base0D: '#66d9ef',
    base0E: '#ae81ff',
    base0F: '#cc6633',
};

const LogLine: React.FC<ILogLineProps> = ({ log }) => {
    const { type, message, timestamp } = log;
    return (
        <FlexRow
            className={classNames({ 'log-line': true, [type]: true })}
            gap={5}
        >
            <span className="timestamp">
                {moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')}
            </span>
            <span className="type">[{type.toUpperCase()}]:</span>
            {isJSON(message) ? (
                <span className="json-message">
                    <JSONTree
                        shouldExpandNode={() => false}
                        invertTheme={false}
                        theme={theme}
                        data={JSON.parse(message)}
                    />
                </span>
            ) : (
                <span className="message">{message}</span>
            )}
        </FlexRow>
    );
};

interface ILogViewProps {
    logs: LogData[];
    clearLogs: () => void;
}

export const LogView: React.FC<ILogViewProps> = ({ logs, clearLogs }) => {
    return (
        <FlexColumn className="logs-container">
            <FlexColumn className="logs">
                {logs.map((l, i) => (
                    <LogLine key={i} log={l} />
                ))}
            </FlexColumn>
        </FlexColumn>
    );
};