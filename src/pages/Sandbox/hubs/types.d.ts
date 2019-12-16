type LogType = 'log' | 'warn' | 'error';

interface LogData {
    graphId: string;
    message: string;
    type: LogType;
    timestamp?: number;
}
