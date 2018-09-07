import React from "react";
import { observer } from "mobx-react";
import classNames from 'classnames';
import { Node } from '.';
import { InputFlowPort, OutputFlowPort } from "./Ports/FlowPort";
import { InputValuePort, OutputValuePort } from "./Ports/ValuePort";

const InputList = ({ flowInputs, valueInputs } : { flowInputs: Array<InputFlowPort>, valueInputs: Array<InputValuePort> }) => 
    <div />

const OutputList = ({ flowOutputs, valueOutputs } : { flowOutputs: Array<OutputFlowPort>, valueOutputs: Array<OutputValuePort> }) => 
    <div />

const NodeView = observer(({ node, size } : { node: Node, size: [number, number] }) => {

    const nodeClasses = classNames({
        "node": true
    });

    const [width, height] = size;

    return (
        <foreignObject width={width} height={height}>
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
});

export default NodeView;