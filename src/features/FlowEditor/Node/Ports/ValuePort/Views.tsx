import * as React from "react";
import { InputValuePort, OutputValuePort } from ".";
import classNames from "classnames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircle as faCircleSolid } from '@fortawesome/free-solid-svg-icons';
import { observer } from "mobx-react";
import { store } from "../../../store/store";
import { AnyPort } from "../types";

@observer
class PortIcon extends React.Component<{ port : AnyPort }> {

    private onPortClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
    
        const { x, y, width, height } = (e.target as Element).getBoundingClientRect() as DOMRect;
        const [halfWidth, halfHeight] = [width / 2, height / 2];
    
        const sourcePos : XYCoords = [x + halfWidth, y + halfHeight];
        store.graph.startLink(this.props.port, sourcePos);
    }

    public render() {

        const { connected } = this.props.port;

        const portClass = classNames({
            "connection": true,
            "value": true,
            "connected": connected
        });
    
        const circleIcon = connected ? faCircleSolid : faCircle;

        return (
            <span className={portClass} onClick={this.onPortClick}><FontAwesomeIcon icon={circleIcon} size="sm" /></span>
        )
    }

}

const InputValuePortView = ({ port } : { port: InputValuePort }) => {
    return (
        <>
            <PortIcon port={port} />
            <span>{port.label}</span>
        </>
    )
}

const OutputValuePortView = ({ port } : { port: OutputValuePort }) => {
    return (
        <>
            <span>{port.label}</span>
            <PortIcon port={port} />
        </>
    )
}

export { InputValuePortView, OutputValuePortView };