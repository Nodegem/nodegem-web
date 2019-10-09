import { BaseHub } from 'hubs/base-hub';
import { SimpleObservable } from 'utils/simple-observable';

const terminalPath = process.env.REACT_APP_TERMINAL_HUB as string;

class TerminalHub extends BaseHub {
    public log: SimpleObservable<LogData>;

    constructor() {
        super(terminalPath);

        this.log = new SimpleObservable<LogData>();

        this.on('ReceiveLogAsync', (message: string, type: LogType) =>
            this.log.execute({ message, type })
        );
    }

    public dispose() {
        this.log.clear();
        super.dispose();
    }
}

export default TerminalHub;
