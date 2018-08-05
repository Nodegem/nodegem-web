import { PureComponent } from "react";
import IOCore, { IOCoreProps, IOProps } from "./IOCore/IOCore";
import Socket from "../../Link/Socket/Socket";

export default abstract class IOBase extends PureComponent<IOProps & IOCoreProps> {

    static defaultProps : Partial<IOProps & IOCoreProps> = {
        onHover: () => {},
        onBlur: () => {},
        onToggle: (t) => t(),
        onSocketHover: () => {},
        onSocketBlur: () => {},
        onClick: () => {}
    }

    protected onBlur = (core: IOCore) : void => {
        this.props.onBlur!(this, core);
    }

    protected onHover = (core: IOCore) : void => {
        this.props.onHover!(this, core);
    }

    protected onSocketHover = (socket: Socket) : void => {
        this.props.onSocketHover!(socket, this);
    }

    protected onSocketBlur = (socket: Socket) : void => {
        this.props.onSocketHover!(socket, this);
    }

    protected onClick = (e: MouseEvent, io: IOCore) : void => {
        this.props.onClick!(e, this);
    }

    public abstract render();

}