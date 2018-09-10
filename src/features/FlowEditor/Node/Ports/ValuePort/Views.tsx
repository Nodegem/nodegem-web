import * as React from "react";
import { InputValuePort, OutputValuePort } from ".";
import classNames from "classnames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCircle as faCircleSolid } from '@fortawesome/free-solid-svg-icons';

const portClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const { x, y, width, height } = (e.target as Element).getBoundingClientRect() as DOMRect;
    const [halfWidth, halfHeight] = [width / 2, height / 2];
}

const PortIcon = ({ connected } : { connected: boolean }) => {

    const portClass = classNames({
        "connection": true,
        "value": true,
        "connected": connected
    });

    const circleIcon = connected ? faCircleSolid : faCircle;

    return (
        <span className={portClass} onClick={portClick} onContextMenu={portClick}><FontAwesomeIcon icon={circleIcon} size="sm" /></span>
    )
}

const InputValuePortView = ({ port } : { port: InputValuePort }) => {
    return (
        <>
            <PortIcon connected={port.connected} />
            <span>{port.label}</span>
        </>
    )
}

const OutputValuePortView = ({ port } : { port: OutputValuePort }) => {
    return (
        <>
            <span>{port.label}</span>
            <PortIcon connected={port.connected} />
        </>
    )
}

export { InputValuePortView, OutputValuePortView };