type LogType = 'log' | 'debug' | 'warn' | 'error';

interface LogData {
    message: string;
    type: LogType;
    unread?: boolean;
}
