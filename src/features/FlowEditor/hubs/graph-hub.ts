import * as signalR from '@aspnet/signalr';

const flowGraphHubConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/flowGraphHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

export const startConnectionToGraphHub = (onConnected: () => void) => {
    flowGraphHubConnection.start().then(onConnected);
}

export const disconnectFromGraphHub = (onDisconnect: () => void) => {
    flowGraphHubConnection.stop().then(onDisconnect);
}

export const run = (data: RunGraphData) => {
    flowGraphHubConnection.invoke("Run", data);
}