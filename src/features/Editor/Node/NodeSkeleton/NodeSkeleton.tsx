import React, { PureComponent, CSSProperties } from "react";

import "./NodeSkeleton.scss";
import NodeCore, { NodeCoreProps } from "../NodeCore/NodeCore";
import classNames from "classnames";
import { isFunction } from "util";

export type NodeContentStyles = {title?: CSSProperties, body?: CSSProperties, footer?: { visible: CSSProperties, collapsed: CSSProperties }};

export type NodeSkeletonProps = {
    size: [number, number];
    contentStyles?: NodeContentStyles;
    expandSize?: number;
    handle?: string | null;
    title: (toggleFooter: Function, footerVisibility: boolean) => JSX.Element | JSX.Element | null;
    body: (toggleFooter: Function, footerVisibility: boolean) => JSX.Element | JSX.Element | null;
    footer?: (toggleFooter: Function, footerVisibility: boolean) => JSX.Element | null;
    footerCollapseHandle?: (toggleFooter: Function, footerVisibility: boolean) => JSX.Element | null;
    showFooterByDefault?: boolean;
}

export type NodeSkeletonState = {
    showFooter: boolean;
}

export default class NodeSkeleton extends PureComponent<NodeSkeletonProps & NodeCoreProps, NodeSkeletonState> {

    static defaultProps : Partial<NodeSkeletonProps> = {
        showFooterByDefault: false,
        footer: () => null,
        footerCollapseHandle: () => null,
        handle: ".title",
        contentStyles: {
            title: {},
            body: {},
            footer: {
                visible: {},
                collapsed: {}
            }
        }
    }

    state = {
        showFooter: this.props.showFooterByDefault!
    }

    private toggleFooter = () => {
        this.setState({showFooter: !this.state.showFooter});
    }

    public render() {

        const { size, title, body, footer, expandSize,
                footerCollapseHandle, handle, contentStyles } = this.props;
        const { showFooter } = this.state;

        let [width, height] = size;
        if(showFooter && expandSize) {
            height += expandSize;
        }

        const footerClass = classNames({
            "footer": true,
            "collapsed": showFooter
        });

        return (
            <NodeCore size={[width, height]} handle={handle}>
                <div className="title" style={contentStyles!.title} >
                    {isFunction(title) ? title(this.toggleFooter, showFooter) : title}
                </div>
                <div className="body" style={contentStyles!.body}>
                    {isFunction(body) ? body(this.toggleFooter, showFooter) : body}
                </div>
                <div className={footerClass} style={(showFooter ? contentStyles!.footer!.visible : contentStyles!.footer!.collapsed) || {}}>
                    {showFooter 
                        ? footer!(this.toggleFooter, showFooter)
                        : footerCollapseHandle!(this.toggleFooter, showFooter)
                    }
                </div>
            </NodeCore>
        )
    }

}