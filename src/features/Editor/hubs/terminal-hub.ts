import { BaseHub } from 'src/hubs/base-hub';
import { SimpleObservable } from 'src/utils/simple-observable';

const terminalPath = process.env.REACT_APP_TERMINAL_HUB as string;

class TerminalHub extends BaseHub {

    private log: SimpleObservable<string>;
    private logWarn: SimpleObservable<string>;
    private logError: SimpleObservable<string>;

    constructor() {
        super(terminalPath);

        this.log = new SimpleObservable<string>();
        this.logWarn = new SimpleObservable<string>();
        this.logError = new SimpleObservable<string>();

        this.onLog(x => console.log(x));
        this.onLogWarn(x => console.warn(x));
        this.onLogError(x => console.error(x));

        this.on("ReceiveLog", this.log.execute);
        this.on("ReceiveWarnLog", this.logWarn.execute);
        this.on("ReceiveErrorLog", this.logError.execute);
    }

    public onLog(listener: (data: string) => void) {
        this.log.subscribe(listener);
    }

    public onLogWarn(listener: (data: string) => void) {
        this.logWarn.subscribe(listener);
    }

    public onLogError(listener: (data: string) => void) {
        this.logError.subscribe(listener);
    }

    public dispose() {
        super.dispose();

        this.log.clear();
        this.logWarn.clear();
        this.logError.clear();
    }
}

export default TerminalHub;