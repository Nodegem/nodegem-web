import React, {PureComponent} from "react";

import './Input.scss';
import classNames from "classnames";

export type InputProps = {
    name: string;
    onClick?: (e: React.MouseEvent) => void;
    onMouseUp?: (e: React.MouseEvent) => void;
}

export type InputState = {
    hover: boolean;
}

export default class Input extends React.PureComponent<InputProps, InputState> {

    state = {
        hover: false
    }

    static defaultProps = {
        onClick: () => {},
        onMouseUp: () => {}
    }

    private handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        this.props.onClick!(e);
    }

    private handleMouseUp = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        this.props.onMouseUp!(e);
    }

    private handleMouseOver = (e: React.MouseEvent) => {
        this.setState({hover: true});
    }

    private handleMouseOut = (e: React.MouseEvent) => {
        console.log("Hello?");
        this.setState({hover: false});
    }

    public render() {

        const { name } = this.props;
        const { hover } = this.state;

        const socketClassName = classNames({
            "socket": true,
            "hover": hover
        });

        const inputClassName = classNames({
            "input": true,
            "hover": hover
        });

        const labelClassName = classNames({
            "label": true,
            "hover": hover
        });

        return (
            <li className="node-input">
                <a className={inputClassName} onClick={this.handleClick} onMouseUp={this.handleMouseUp} href="#">
                    <i className={socketClassName} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} />
                    <span className={labelClassName}>{name}</span>
                </a>
            </li>
        );

    }

}