import React, { PureComponent } from "react";
import classNames from "classnames";
import { IOProps, IOState } from "../IOCore";

export default class Input extends PureComponent<IOProps, IOState> {

    public render() {

        const inputClass = classNames({
            "input": true
        });

        return (
            <div className={inputClass}>
            </div>
        );

    }

}