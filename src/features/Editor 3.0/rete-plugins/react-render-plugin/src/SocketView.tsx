import * as React from 'react';
import { IO } from 'src/features/Editor 3.0/rete-engine/io';

type SocketViewProps = { bindSocket: Function, io: IO, type: string };
class SocketView extends React.Component<SocketViewProps> {
    
    container: HTMLDivElement;

    public componentDidMount() {
        this.props.bindSocket(this.container, this.props.type, this.props.io);
    }

    public render() {
        return (
            <div ref={(el) => this.container = el!}>
                I'm a socket
            </div>
        )
    }

}

export default SocketView;