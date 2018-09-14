import classNames from "classnames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircle as faCircleSolid } from '@fortawesome/free-solid-svg-icons';
import { observer } from "mobx-react";
import * as React from "react";
import { AnyPort, FlowPort, ValuePort } from "./types";
import { Icon } from "antd";

@observer
class PortIconView extends React.Component<{ port : AnyPort }> {

    componentDidMount() {
        this.props.port.onMount();
    }

    public render() {

        const { port } = this.props;

        const portClass = classNames({
            "connection": true,
            [port.type]: true,
            "connected": port.connected,
            [port.elementId]: true
        });
    

        return (
            <span className={portClass} id={port.portId}>
                {this.props.children}
            </span>
        )
    }

}

const FlowPortIconView = ({ port } : { port: FlowPort }) => {
    const direction = port.ioType === "input" ? "caret-left" : "caret-right";
    return (
        <PortIconView port={port}>
            <Icon type={direction} theme="outlined" />
        </PortIconView>
    )
};


const ValuePortIconView = ({ port } : { port: ValuePort }) => {
    const circleIcon = port.connected ? faCircleSolid : faCircle;
    return (
        <PortIconView port={port}>
            <FontAwesomeIcon icon={circleIcon} size="xs" />
        </PortIconView>
    )
}

export { ValuePortIconView, FlowPortIconView };