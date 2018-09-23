import * as signalR from '@aspnet/signalr';

const flowGraphHubConnection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/flowGraphHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();