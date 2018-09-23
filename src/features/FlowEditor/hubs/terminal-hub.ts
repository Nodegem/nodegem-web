import { SimpleObservable, SimpleObservableAction } from './utils/SimpleObservable';
import * as signalR from '@aspnet/signalr';

const terminalHubConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/terminalHub")
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