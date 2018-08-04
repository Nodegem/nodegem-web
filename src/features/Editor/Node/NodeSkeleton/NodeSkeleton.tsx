import React, { PureComponent, CSSProperties } from "react";

import "./NodeSkeleton.scss";
import NodeCore, { NodeCoreProps } from "../NodeCore/NodeCore";
import { isFunction } from "util";
import { XYCoords } from "../../utils/types";

export type NodeContentStyles = {title?: CSSProperties, body?: CSSProperties, footer?: CSSProperties};

export type NodeSkeletonProps = {
    size: [number, number];
    position?: XYCoords;
    contentStyles?: NodeContentStyles;
    expandSize?: number;
    handle?: string | null;
    title: (toggleFooter: Function, footerVisibility: boolean) => JSX.Element | JSX.Element | null;
    body: (toggleFooter: Function, footerVisibility: boolean) => JSX.Element | JSX.Element | null;
    footer?: (toggleFooter: Function, footerVisibility: boolean) => JSX.Element | JSX.Element | null;
    showFooterByDefault?: boolean;
}

export type NodeSkeletonState = {
    showFooter: boolean;
}

export default class NodeSkeleton extends PureComponent<NodeSkeletonProps & NodeCoreProps, NodeSkeletonState> {

    static defaultProps : Partial<NodeSkeletonProps> = {
        showFooterByDefault: false,
        footer: () => null,
        handle: ".title",
        contentStyles: {
            title: {},
            body: {},
            footer: {}
        }
    }

    state = {
        showFooter: this.props.showFooterByDefault!
    }

    private toggleFooter = () => {
        this.setState({showFooter: !this.state.showFooter});
    }

    public render() {

        const { size, title, body, footer, expandSize, handle, contentStyles, position } = this.props;
        const { showFooter } = this.state;

        let [width, height] = size;
        if(showFooter && expandSize) {
            height += expandSize;
        }

        return (
            <NodeCore position={position} size={[width, height]} handle={handle}>
                <div className="title" style={contentStyles!.title} >
                    {isFunction(title) ? title(this.toggleFooter, showFooter) : title}
                </div>
                <div className="body" style={contentStyles!.body}>
                    {isFunction(body) ? body(this.toggleFooter, showFooter) : body}
                </div>
                {
                    showFooter && (
                        <div className="footer" style={showFooter && contentStyles!.footer}>
                            {isFunction(footer) ? footer!(this.toggleFooter, showFooter) : footer}
                        </div>
                    )
                }
            </NodeCore>
        )
    }

}