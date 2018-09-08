import React from "react";
import { observer } from "mobx-react";
import classNames from 'classnames';
import { Node } from '.';
import { InputFlowPort, OutputFlowPort } from "./Ports/FlowPort";
import { InputValuePort, OutputValuePort } from "./Ports/ValuePort";

import "./Node.scss";

const InputList = ({ flowInputs, valueInputs } : { flowInputs: Array<InputFlowPort>, valueInputs: Array<InputValuePort> }) => 
    <div />

const OutputList = ({ flowOutputs, valueOutputs } : { flowOutputs: Array<OutputFlowPort>, valueOutputs: Array<OutputValuePort> }) => 
    <div />

@observer
class NodeView extends React.Component<{ node: Node, defaultWidth: number }> {

    onNodeClick = (e: React.MouseEvent) => {
        console.log("Hello world");
    }

    public render() {

        const { node, defaultWidth } = this.props;

        const nodeClasses = classNames({
            "node": true
        });
    
        const numFields = Math.max(node.numInputs, node.numOutputs);
        const defaultTitleHeight = 45;
        const defaultFieldHeight = 20;
        const nodeHeight = numFields * defaultFieldHeight + defaultTitleHeight;
        
        return (
            <foreignObject width={defaultWidth} height={nodeHeight} onMouseDown={this.onNodeClick}>
                <div className={nodeClasses}>
                    <div className="header">
                        <span className="title">{node.title}</span>
                    </div>
                    <div className="content">
                        <InputList flowInputs={node.inputFlowPorts} valueInputs={node.inputValuePorts} />
                        <OutputList flowOutputs={node.outputFlowPorts} valueOutputs={node.outputValuePorts} />
                    </div>
                </div>
            </foreignObject>
        );
    }
}

export default NodeView;