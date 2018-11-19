import { SimpleObservable, SimpleObservableAction } from './utils/simple-observable';
import * as signalR from '@aspnet/signalr';

const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const terminalHubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/terminalHub`)
    .configureLogging(signalR.LogLevel.Information)
    .build();

const terminalObservable = new SimpleObservable();

terminalHubConnection.on("ReceiveLog", data => {
    terminalObservable.execute(data);
});

export const startListeningToTerminalHub = (onConnected: () => void, onError?: (error: any) => void) => {
    terminalHubConnection.start().then(onConnected).catch(err => { 
        if(onError) onError(err);
        console.error(err);
    });
}

export const subscribeToTerminal = (action: SimpleObservableAction<any>) => {
    terminalObservable.subscribe(action);
}

export const unSubscribeFromTerminal = (action: SimpleObservableAction<any>) => {
    terminalObservable.unSubscribe(action);
}

export const stopListeningToTerminal = () => {
    terminalHubConnection.stop();
}
