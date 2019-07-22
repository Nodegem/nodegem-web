import { BaseHub } from 'hubs/base-hub';
import { SimpleObservable } from 'utils/simple-observable';

const terminalPath = process.env.REACT_APP_TERMINAL_HUB as string;

class TerminalHub extends BaseHub {
    private log: SimpleObservable<string>;
    private logDebug: SimpleObservable<string>;
    private logWarn: SimpleObservable<string>;
    private logError: SimpleObservable<string>;

    constructor() {
        super(terminalPath);

        this.log = new SimpleObservable<string>();
        this.logDebug = new SimpleObservable<string>();
        this.logWarn = new SimpleObservable<string>();
        this.logError = new SimpleObservable<string>();

        this.on('ReceiveLog', this.log.execute);
        this.on('ReceiveDebugLog', this.logDebug.execute);
        this.on('ReceiveWarnLog', this.logWarn.execute);
        this.on('ReceiveErrorLog', this.logError.execute);
    }

    public onLog(listener: (data: string) => void) {
        this.log.subscribe(listener);
    }

    public onLogDebug(listener: (data: string) => void) {
        this.logDebug.subscribe(listener);
    }

    public onLogWarn(listener: (data: string) => void) {
        this.logWarn.subscribe(listener);
    }

    public onLogError(listener: (data: string) => void) {
        this.logError.subscribe(listener);
    }

    public dispose() {
        this.log.clear();
        this.logDebug.clear();
        this.logError.clear();
        this.logWarn.clear();
        super.dispose();
    }
}

export default TerminalHub;
