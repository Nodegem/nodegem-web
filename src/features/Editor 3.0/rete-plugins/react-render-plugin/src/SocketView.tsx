import * as React from 'react';
import { IO } from 'src/features/Editor 3.0/rete-engine/io';
import './Socket.less';

type SocketType = "input" | "output";
type SocketViewProps = { bindSocket: Function, io: IO, type: SocketType };
class SocketView extends React.Component<SocketViewProps> {
    
    container: HTMLDivElement;

    public componentDidMount() {
        this.props.bindSocket(this.container, this.props.type, this.props.io);
    }

    public render() {
        const {type, io} = this.props;
        return (
            <div ref={(el) => this.container = el!} className={`socket ${type} ${io.socket.name.toLowerCase()}`} />
        )
    }

}

export default SocketView;