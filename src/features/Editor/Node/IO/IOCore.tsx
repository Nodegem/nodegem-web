import React, { PureComponent } from "react";

export type IOType = "input" | "output";

export type IOProps = {
    type: IOType;
}

export type IOState = {
    hovered: boolean;
}

export default class IOCore extends PureComponent<IOProps, IOState> {

    public render() {
        return (
            null
        );
    }

}