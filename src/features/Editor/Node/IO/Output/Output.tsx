import React, {PureComponent} from "react";

import './Output.scss';
import classNames from "classnames";

export type OutputProps = {
    name: string;
    onMouseDown?: (e: React.MouseEvent) => void;
}

export type OutputState = {
    hover: boolean;
}

export default class Output extends React.PureComponent<OutputProps, OutputState> {

    state = {
        hover: false
    }

    static defaultProps = {
        onMouseDown: () => {}
    }

    private handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();

        this.props.onMouseDown!(e);
    }

    public render() {

        const { name } = this.props;
        const { hover } = this.state;

        const socketClassName = classNames({
            "socket": true,
            "hover": hover
        });

        const outputClassName = classNames({
            "output": true,
            "hover": hover
        });

        const labelClassName = classNames({
            "label": true,
            "hover": hover
        });

        return (
            <li className="node-output" onMouseDown={this.handleClick}>
               <a className={outputClassName} href="#" onClick={this.handleClick}>
                    <span className={labelClassName}>{name}</span>
                    <i className={socketClassName} />
                </a>
            </li>
        )
    }

}