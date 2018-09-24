import * as signalR from '@aspnet/signalr';

const flowGraphHubConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/flowGraphHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

export const startConnectionToFlowGraph = (onConnected: () => void) => {
    flowGraphHubConnection.start().then(onConnected);
}

export const run = () => {
    flowGraphHubConnection.invoke("Run");
}