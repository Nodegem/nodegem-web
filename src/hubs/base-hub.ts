import * as signalR from '@aspnet/signalr';
import { getBaseApiUrl, exponentialBackoff } from 'src/utils';
import { SimpleObservable } from '../utils/simple-observable';
import { userStore } from 'src/stores';

abstract class BaseHub {
    private connection: signalR.HubConnection;

    public onConnected: SimpleObservable;
    public onDisconnected: SimpleObservable;
    public onException: SimpleObservable<(reason: any) => void>;

    private connected: boolean = false;
    private forceClosed: boolean = false;

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
                accessTokenFactory: () => userStore.getToken()!,
            })
            .configureLogging(logLevel)
            .build();

        this.connection.onclose(async () => {
            this.connected = false;
            this.onDisconnected.execute(undefined);
            await this.attemptConnect();
        });
    }

    public async attemptConnect() {
        this.forceClosed = false;
        if (!this.shouldAttemptToConnect()) return;

        await exponentialBackoff(
            async () => await this.start(),
            () => {
                console.log('Given up at this point');
            }
        );
    }

    protected async on(method: string, callback: any) {
        try {
            await this.connection.on(method, callback);
        } catch (e) {
            console.warn(e);
        }
    }

    protected async invoke(method: string, ...params: any[]) {
        try {
            await this.connection.invoke(method, ...params);
        } catch (e) {
            console.error(e);
        }
    }

    private async start(): Promise<boolean> {
        if (this.forceClosed) return true;

        try {
            await this.connection.start();
            this.connected = true;
            this.onConnected.execute(undefined);
        } catch (err) {
            this.connected = false;
            console.warn(err);
            this.onException.execute(err);
        }

        return this.connected;
    }

    private shouldAttemptToConnect(): boolean {
        return !this.forceClosed && !this.connected;
    }

    public async disconnect() {
        try {
            await this.connection.stop();
        } catch (err) {
            this.onException.execute(err);
        } finally {
            this.forceClosed = true;
        }
    }

    public dispose() {
        this.onDisconnected.clear();
        this.onConnected.clear();
        this.onException.clear();
        this.disconnect();
    }
}

export { BaseHub };
