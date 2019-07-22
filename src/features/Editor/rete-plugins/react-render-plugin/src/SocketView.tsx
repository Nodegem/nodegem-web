import './Socket.less';

import { IO } from 'features/Editor/rete-engine/io';
import * as React from 'react';

type SocketType = 'input' | 'output';
type SocketViewProps = {
    bindSocket: (container: HTMLDivElement, type: SocketType, io: IO) => void;
    io: IO;
    type: SocketType;
};
class SocketView extends React.Component<SocketViewProps> {
    public container: HTMLDivElement;

    public componentDidMount() {
        this.props.bindSocket(this.container, this.props.type, this.props.io);
    }

    public render() {
        const { type, io } = this.props;
        return (
            <div
                ref={el => (this.container = el!)}
                className={`socket ${type} ${io.socket.name.toLowerCase()}`}
            />
        );
    }
}

export default SocketView;
