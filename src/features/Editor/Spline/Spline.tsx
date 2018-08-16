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
    handleRadius?: number;
    handleColor?: string;
    curve?: d3.CurveFactory | d3.CurveFactoryLineOnly;
    onClick?: (e: React.MouseEvent, spline: Spline) => void;
    onClickOutside?: (e: React.MouseEvent, spline: Spline) => void;
    linkTransform?: (values: XYCoords[]) => XYCoords[];
}

export type SplineState = {
    selected: boolean;
}

type CombinedProps = SplineProps & InjectedOnClickOutProps;

export default class Spline extends PureComponent<CombinedProps, SplineState> implements HandleClickOutside<any> {

    static defaultProps : Partial<SplineProps> = {
        onClick: (e: React.MouseEvent) => {},
        onClickOutside: (e: React.MouseEvent) => {},
        linkTransform: (values) => values,
        color: "black",
        handleColor: "black",
        handleRadius: 5,
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
        this.props.onClickOutside!(e, this);
    }

    handleClick = (e: React.MouseEvent) : void => {
        console.log(e);
        this.setState({selected: !this.state.selected});
        this.props.onClick!(e, this);
    }

    public render() {

        const { selected } = this.state;
        const { start, end, strokeSize, color, handleColor, handleRadius, linkTransform } = this.props;

        const pathString = this.lineFunc(linkTransform!([start, end]))!;

        const className = classNames({
            "connector": true,
            "selected": selected
        });

        return (
            <g>
                <path className="connector-click-area" d={pathString} onMouseDown={this.handleClick} fill="none" stroke="transparent" />
                <path className={className} d={pathString} stroke={color} strokeWidth={strokeSize} onMouseDown={this.handleClick} />
                <circle cx={start[0]} cy={start[1]} r={handleRadius} fill={handleColor} />
                <circle cx={end[0]} cy={end[1]} r={handleRadius} fill={handleColor} />
            </g>
        )
    }

}

export const SplineComponent = onClickOutside(Spline);