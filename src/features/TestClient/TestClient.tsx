import React from 'react';
import * as signalR from '@aspnet/signalr';

const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/graphHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.on("Running", (user, message) => {
    console.log(process.env);
    console.log(user, message);
})

connection.start()
    .then(() => connection.invoke("Run", "Test", "run"))
    .catch(err => console.error(err));


export default class TestClient extends React.PureComponent {

    public render() {

        return (
            <div>Hello</div>
        )

    }

} 