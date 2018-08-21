import React, { PureComponent } from "react";
import { XYCoords } from "../utils/types";
import * as d3 from "d3";
import onClickOutside, { HandleClickOutside, InjectedOnClickOutProps } from 'react-onclickoutside';
import classNames from "classnames";
import Output from "../Node/IO/Output/Output";
import Input from "../Node/IO/Input/Input";

import './Spline.scss';

export type SplineProps = {
    start: XYCoords;
    end: XYCoords;
    sourceField?: Output;
    toField?: Input;
    mousePos?: XYCoords;
    color?: string;
    strokeSize?: number;
    handleRadius?: number;
    handleColor?: string;
    curve?: d3.CurveFactory | d3.CurveFactoryLineOnly;
}

type SplineHandlers = {
    onClick?: (e: React.MouseEvent, spline: Spline) => void;
    onRightClick?: (e: React.MouseEvent, spline: Spline) => void;
    onClickOutside?: (e: React.MouseEvent, spline: Spline) => void;
    linkTransform?: (values: XYCoords[]) => XYCoords[];
}

export type SplineState = {
    selected: boolean;
}

type CombinedProps = SplineProps & SplineHandlers & InjectedOnClickOutProps;

class Spline extends PureComponent<CombinedProps, SplineState> implements HandleClickOutside<any> {

    static defaultProps : Partial<SplineProps & SplineHandlers> = {
        onClick: () => {},
        onClickOutside: () => {},
        onRightClick: () => {},
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
        this.setState({selected: !this.state.selected});
        this.props.onClick!(e, this);
    }

    private handleRightClick = (e: React.MouseEvent) : void => {
        this.props.onRightClick!(e, this);
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
                <path className="connector-click-area" d={pathString} onClick={this.handleClick} 
                    fill="none" stroke="transparent" onContextMenu={this.handleRightClick} />
                <path className={className} d={pathString} stroke={color} strokeWidth={strokeSize} 
                    onClick={this.handleClick} onContextMenu={this.handleRightClick} />
                <circle cx={start[0]} cy={start[1]} r={handleRadius} fill={handleColor} />
                <circle cx={end[0]} cy={end[1]} r={handleRadius} fill={handleColor} />
            </g>
        )
    }

}

export default onClickOutside(Spline);