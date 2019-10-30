import * as signalR from '@microsoft/signalr';
import { userStore } from 'stores';
import { getBaseApiUrl } from 'utils';
import { SimpleObservable } from '../utils/simple-observable';

const retries = [0, 1000, 2000, 5000, 10000, 20000, 30000, 60000];

abstract class BaseHub {
    get isConnected(): boolean {
        return this.connection.state === signalR.HubConnectionState.Connected;
    }

    public onConnected: SimpleObservable;
    public onConnecting: SimpleObservable;
    public onReconnecting: SimpleObservable;
    public onReconnected: SimpleObservable;
    public onDisconnected: SimpleObservable;
    public onException: SimpleObservable<(reason: any) => void>;
    private connection: signalR.HubConnection;

    private forceClosed = false;

    constructor(
        hub: string,
        logLevel: signalR.LogLevel = signalR.LogLevel.Information
    ) {
        this.onConnected = new SimpleObservable();
        this.onDisconnected = new SimpleObservable();
        this.onConnecting = new SimpleObservable();
        this.onReconnected = new SimpleObservable();
        this.onReconnecting = new SimpleObservable();
        this.onException = new SimpleObservable<(reason: any) => void>();

        const baseUrl = getBaseApiUrl();
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/${hub}`, {
                accessTokenFactory: () => userStore.token!.accessToken!,
                transport: signalR.HttpTransportType.WebSockets,
            })
            .configureLogging(logLevel)
            .withAutomaticReconnect(retries)
            .build();

        this.connection.onreconnected(() => {
            this.onReconnected.execute();
        });

        this.connection.onreconnecting(() => {
            this.onReconnecting.execute();
        });

        this.connection.onclose(async () => {
            if (this.forceClosed) {
                return;
            }

            this.onDisconnected.execute();
            await this.start();
        });
    }

    public async disconnect() {
        try {
            this.forceClosed = true;
            await this.connection.stop();
        } catch (err) {
            this.onException.execute(err);
        }
    }

    public dispose() {
        this.onConnecting.clear();
        this.onDisconnected.clear();
        this.onConnected.clear();
        this.onException.clear();
        this.onReconnected.clear();
        this.onReconnected.clear();
        this.disconnect();
    }

    protected on(method: string, callback: any) {
        try {
            this.connection.on(method, callback);
        } catch (e) {
            console.warn(e);
        }
    }

    protected async invoke(method: string, ...params: any[]): Promise<void> {
        try {
            return await this.connection.invoke(method, ...params);
        } catch (e) {
            console.error(e);
        }
    }

    public async start() {
        try {
            this.onConnecting.execute();
            this.forceClosed = false;
            await this.connection.start();
            this.onConnected.execute();
        } catch (err) {
            console.warn(err);
            this.onException.execute(err);
        }
    }
}

export { BaseHub };
