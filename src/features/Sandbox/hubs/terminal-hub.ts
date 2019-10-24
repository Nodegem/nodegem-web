import { BaseHub } from 'hubs/base-hub';
import { SimpleObservable } from 'utils/simple-observable';

class TerminalHub extends BaseHub {
    public log: SimpleObservable<LogData>;

    constructor() {
        super('terminalHub');

        this.log = new SimpleObservable<LogData>();

        this.on(
            'ReceiveLogAsync',
            (graphId: string, message: string, type: LogType) =>
                this.log.execute({ graphId, message, type })
        );
    }

    public dispose() {
        this.log.clear();
        super.dispose();
    }
}

export default TerminalHub;
