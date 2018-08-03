import React, { PureComponent } from "react";
import IOCore, { IOCoreProps, IOProps } from "../IOCore/IOCore";
import Socket from "../../../Link/Socket/Socket";

import './Input.scss';

export default class Input extends PureComponent<IOProps & IOCoreProps> {

    static defaultProps : Partial<IOProps & IOCoreProps> = {
        onHover: () => {},
        onBlur: () => {},
        onToggle: () => {}
    }

    public render() {

        const { label, className, onToggle} = this.props;

        return (
            <IOCore type="input" className={className}>
                <Socket toggle={(t) => onToggle!(t)}/>
                <span className="label">{label}</span>
            </IOCore>
        );

    }

}