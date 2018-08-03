import React, { PureComponent } from "react";
import classNames from "classnames";

import './IOCore.scss';

export type IOProps = {
    label: string;
    onToggle?: (toggle: Function) => void;
}

export type IOCoreProps = {
    className?: string;
    onHover?: () => void;
    onBlur?: () => void;
}

export type IOCoreState = {
    hovering: boolean;
}

type IOType = "input" | "output";

export default class IOCore extends PureComponent<IOCoreProps & {type: IOType} , IOCoreState> {

    static defaultProps : Partial<IOCoreProps> = {
        onHover: () => {},
        onBlur: () => {}
    }

    state = {
        hovering: false
    }

    private onMouseEnter = () => {
        this.setState({hovering: true});
        this.props.onHover!();
    }

    private onMouseLeave = () => {
        this.setState({hovering: false});
        this.props.onBlur!();
    }

    public render() {

        const { hovering } = this.state;
        const { type, className } = this.props;

        const ioClasses = classNames({
            "node-io": true,
            [type]: true,
            [className!]: !!className,
            "hovering": hovering
        });

        return (
            <div className={ioClasses} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                {this.props.children}
            </div>
        );
    }

}