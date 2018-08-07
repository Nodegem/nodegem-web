import React, { PureComponent } from "react";
import { XYCoords } from "../utils/types";

export type TestProps = {
    position: XYCoords;
}

export default class TestCircle extends PureComponent<TestProps> {

    public render() {

        const { position } = this.props;
        const [x, y] = position;

        return (
            <circle cx={x} cy={y} r={8} color="blue" />
        )
    }

}