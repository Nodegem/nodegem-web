import { SimpleObservable } from './../utils/simple-observable';
import * as signalR from '@aspnet/signalr';
import { getBaseApiUrl } from 'src/utils';

abstract class BaseHub {

    private connection: signalR.HubConnection;

    public onConnected : SimpleObservable;
    public onDisconnected : SimpleObservable<Error | undefined>;
    public onException: SimpleObservable<(reason: any) => void>;

    private connected: boolean = false;

    get isConnected() : boolean {
        return this.connected;
    }

    constructor(hub: string, logLevel: signalR.LogLevel = signalR.LogLevel.Information) {

        this.onConnected = new SimpleObservable();
        this.onDisconnected = new SimpleObservable<Error | undefined>();
        this.onException = new SimpleObservable<(reason: any) => void>();

        const baseUrl = getBaseApiUrl();
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/${hub}`)
            .configureLogging(logLevel)
            .build();

        this.connection.onclose(async err => {
            this.connected = false;
            this.onDisconnected.execute(err);
        })
    }

    protected on(method: string, callback: any) {
        this.connection.on(method, callback);
    }

    protected invoke(method: string, data: any) {
        this.connection.invoke(method, data);
    }

    public start() {
        if(!this.connected) {
            this.connection.start().then(async () => {
                this.onConnected.execute(undefined); 
                this.connected = true;
            }).catch(this.onException.execute);
        }
    }

    public disconnect() {
        this.connection.stop().catch(this.onException.execute);
    }

    public dispose() {
        this.onDisconnected.clear();
        this.onConnected.clear();
        this.onException.clear();
    }

}

export { BaseHub };