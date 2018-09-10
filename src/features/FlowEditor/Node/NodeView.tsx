import React from "react";
import { observer } from "mobx-react";
import classNames from 'classnames';
import { Node } from '.';
import { InputFlowPort, OutputFlowPort } from "./Ports/FlowPort";
import { InputValuePort, OutputValuePort } from "./Ports/ValuePort";
import { createTransform, hasChildWithClass } from "../utils";
import * as d3 from "d3";

import "./Node.scss";
import { InputFlowPortView, OutputFlowPortView } from "./Ports/FlowPort/Views";
import { InputValuePortView, OutputValuePortView } from "./Ports/ValuePort/Views";

const InputList = ({ flowInputs, valueInputs } : { flowInputs: Array<InputFlowPort>, valueInputs: Array<InputValuePort> }) => {
    return (
        <div className="inputs">
            <ul className="flows">
                {
                    flowInputs.map(x => (
                        <li className="port" key={x.key}><InputFlowPortView port={x} /></li>
                    ))
                }
            </ul>
            <ul className="values">
                {
                    valueInputs.map(x => (
                        <li className="port" key={x.key}><InputValuePortView port={x} /></li>
                    ))
                }
            </ul>
        </div>
    );
}

const OutputList = ({ flowOutputs, valueOutputs } : { flowOutputs: Array<OutputFlowPort>, valueOutputs: Array<OutputValuePort> }) => {
    return (
        <div className="outputs">
            <ul className="flows">
                {
                    flowOutputs.map(x => (
                        <li className="port" key={x.key}><OutputFlowPortView port={x} /></li>
                    ))
                }
            </ul>
            <ul className="values">
                {
                    valueOutputs.map(x => (
                        <li className="port" key={x.key}><OutputValuePortView port={x} /></li>
                    ))
                }
            </ul>
        </div>
    );
}

@observer
class NodeView extends React.Component<{ node: Node, defaultWidth: number }> {

    componentDidMount() {
        d3.select(".node")
            .on("mousedown", () => this.onNodeClick(d3.event));
    }

    onNodeClick = (e: React.MouseEvent) => {

        e.stopPropagation();
        e.preventDefault();

        if(hasChildWithClass(e.target as Element, "header")) {
            this.props.node.handleDragStart(e);
        }
    }

    public render() {

        const { node, defaultWidth } = this.props;

        const nodeClasses = classNames({
            "node": true
        });
    
        const numFields = Math.max(node.numInputs, node.numOutputs);
        const defaultTitleHeight = 45;
        const defaultFieldHeight = 25;
        const nodeHeight = numFields * defaultFieldHeight + defaultTitleHeight;
        
        return (
            <foreignObject className="node-shell" width={defaultWidth} height={nodeHeight} 
                transform={createTransform(node.position)} onMouseDown={this.onNodeClick}>
                <div className={nodeClasses}>
                    <div className="header">
                        <span className="title">{node.title}</span>
                    </div>
                    <div className="content">
                        <div className="ports">
                            <InputList flowInputs={node.inputFlowPorts} valueInputs={node.inputValuePorts} />
                            <OutputList flowOutputs={node.outputFlowPorts} valueOutputs={node.outputValuePorts} />
                        </div>
                    </div>
                </div>
            </foreignObject>
        );
    }
}

export default NodeView;