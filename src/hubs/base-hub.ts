import * as signalR from '@aspnet/signalr';
import { userStore } from 'stores';
import { exponentialBackoff, getBaseApiUrl } from 'utils';
import { SimpleObservable } from '../utils/simple-observable';

abstract class BaseHub {
    get isConnected(): boolean {
        return this.connected;
    }

    public onConnected: SimpleObservable;
    public onConnecting: SimpleObservable;
    public onDisconnected: SimpleObservable;
    public onException: SimpleObservable<(reason: any) => void>;
    private connection: signalR.HubConnection;

    private connected: boolean = false;
    private forceClosed: boolean = false;

    constructor(
        hub: string,
        logLevel: signalR.LogLevel = signalR.LogLevel.Information
    ) {
        this.onConnected = new SimpleObservable();
        this.onDisconnected = new SimpleObservable();
        this.onConnecting = new SimpleObservable();
        this.onException = new SimpleObservable<(reason: any) => void>();

        const baseUrl = getBaseApiUrl();
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/${hub}`, {
                accessTokenFactory: () => userStore.token!.accessToken!,
            })
            .configureLogging(logLevel)
            .build();

        this.connection.onclose(async () => {
            this.connected = false;
            this.onDisconnected.execute();

            if (this.forceClosed) {
                return;
            }
            await this.attemptConnect();
        });
    }

    public async attemptConnect() {
        this.forceClosed = false;

        if (this.isConnected) {
            return;
        }

        await exponentialBackoff(
            () => this.start(),
            () => {
                console.log('Given up at this point');
            }
        );
    }

    public async disconnect() {
        this.forceClosed = true;
        try {
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
        this.disconnect();
    }

    protected async on(method: string, callback: any) {
        try {
            await this.connection.on(method, callback);
        } catch (e) {
            console.warn(e);
        }
    }

    protected async invoke<T = void>(
        method: string,
        ...params: any[]
    ): Promise<T | null> {
        try {
            return await this.connection.invoke<T>(method, ...params);
        } catch (e) {
            console.error(e);
        }

        return null;
    }

    private async start(): Promise<boolean> {
        if (this.forceClosed) {
            return true;
        }

        this.onConnecting.execute();

        try {
            await this.connection.start();
            this.connected = true;
            this.onConnected.execute();
        } catch (err) {
            this.connected = false;
            console.warn(err);
            this.onException.execute(err);
        }

        return this.connected;
    }
}

export { BaseHub };
