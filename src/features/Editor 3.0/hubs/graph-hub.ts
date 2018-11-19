import * as signalR from '@aspnet/signalr';

const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const flowGraphHubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/flowGraphHub`)
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