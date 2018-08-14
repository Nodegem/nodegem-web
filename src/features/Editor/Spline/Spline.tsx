import React, { PureComponent } from "react";
import { XYCoords } from "../utils/types";
import * as d3 from "d3";
import onClickOutside, { HandleClickOutside, InjectedOnClickOutProps } from 'react-onclickoutside';
import classNames from "classnames";

import './Spline.scss';

export type SplineProps = {
    start: XYCoords;
    end: XYCoords;
    mousePos?: XYCoords;
    color?: string;
    strokeSize?: number;
    curve?: d3.CurveFactory | d3.CurveFactoryLineOnly;
    onClick?: (e: React.MouseEvent) => void;
    onClickOutside?: (e: React.MouseEvent) => void;
    linkTransform?: (values: XYCoords[]) => XYCoords[];
}

export type SplineState = {
    selected: boolean;
}

type CombinedProps = SplineProps & InjectedOnClickOutProps;

class Spline extends PureComponent<CombinedProps, SplineState> implements HandleClickOutside<any> {

    static defaultProps : Partial<SplineProps> = {
        onClick: (e: React.MouseEvent) => {},
        onClickOutside: (e: React.MouseEvent) => {},
        linkTransform: (values) => values,
        color: "black",
        strokeSize: 2,
        curve: d3.curveLinear
    }

    private get lineFunc() : d3.Line<XYCoords> {
        const { curve } = this.props;
        return d3.line()
            .x((d) => d[0])
            .y((d) => d[1])
            .curve(curve!);
    }

    constructor(props : CombinedProps) {
        super(props);

        this.state = {
            selected: false,
        };
    }

    handleClickOutside = (e: React.MouseEvent<any>) : void => {
        this.setState({selected: false});
        this.props.onClickOutside!(e);
    }

    handleClick = (e: React.MouseEvent) : void => {
        this.setState({selected: true});
        this.props.onClick!(e);
    }

    public render() {

        const { selected } = this.state;
        const { start, end, strokeSize, color, linkTransform } = this.props;

        const pathString = this.lineFunc(linkTransform!([start, end]))!;

        const className = classNames({
            "connector": true,
            "selected": selected
        });

        return (
            <g>
                <path className="connector-click-area" d={pathString} onClick={this.handleClick} />
                <path className={className} d={pathString} stroke={color} strokeWidth={strokeSize} onClick={this.handleClick} />
                <circle cx={start[0]} cy={start[1]} r={3} fill={"#337ab7"} />
                <circle cx={end[0]} cy={end[1]} r={3} fill={"#337ab7"} />
            </g>
        )
    }

}

export default onClickOutside(Spline);