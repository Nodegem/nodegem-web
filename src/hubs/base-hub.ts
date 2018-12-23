import { getBaseApiUrl } from 'src/utils';

import * as signalR from '@aspnet/signalr';

import { SimpleObservable } from '../utils/simple-observable';

abstract class BaseHub {
    private connection: signalR.HubConnection;

    public onConnected: SimpleObservable;
    public onDisconnected: SimpleObservable;
    public onException: SimpleObservable<(reason: any) => void>;

    private connected: boolean = false;

    get isConnected(): boolean {
        return this.connected;
    }

    constructor(
        hub: string,
        logLevel: signalR.LogLevel = signalR.LogLevel.Information
    ) {
        this.onConnected = new SimpleObservable();
        this.onDisconnected = new SimpleObservable();
        this.onException = new SimpleObservable<(reason: any) => void>();

        const baseUrl = getBaseApiUrl();
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/${hub}`, {
                accessTokenFactory: () => '',
            })
            .configureLogging(logLevel)
            .build();

        this.connection.onclose(async () => {
            this.connected = false;
            this.onDisconnected.execute(undefined);
        });
    }

    protected async on(method: string, callback: any) {
        try {
            await this.connection.on(method, callback);
        } catch (e) {
            console.warn(e);
        }
    }

    protected async invoke(method: string, data: any) {
        if (this.isConnected) {
            try {
                await this.connection.invoke(method, data);
            } catch (e) {
                this.connected = false;
                console.log(e);
            }
        } else {
            this.connected = false;
            console.warn('No connection established. Unable to invoke.');
        }
    }

    public async start() {
        if (!this.connected) {
            try {
                await this.connection.start();
                this.connected = true;
                this.onConnected.execute(undefined);
            } catch (err) {
                console.warn(err);
                this.onException.execute(err);
            }
        }
    }

    public async disconnect() {
        try {
            await this.connection.stop();
        } catch (err) {
            this.onException.execute(err);
        }
    }

    public dispose() {
        this.onDisconnected.clear();
        this.onConnected.clear();
        this.onException.clear();
    }
}

export { BaseHub };
