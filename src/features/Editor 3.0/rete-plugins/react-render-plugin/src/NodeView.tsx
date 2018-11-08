import * as React from "react";
import { Node } from "src/features/Editor 3.0/rete-engine/node";
import "./Node.less";
import SocketView from "./SocketView";
import { Input } from "src/features/Editor 3.0/rete-engine/input";
import { Socket } from "src/features/Editor 3.0/rete-engine/socket";
import { Component } from "src/features/Editor 3.0/rete-engine/component";

// const InputList = ({
//     flowInputs,
//     valueInputs
// }: {
//     flowInputs: Array<InputFlowPort>;
//     valueInputs: Array<InputValuePort>;
// }) => {
//     return (
//         <div className="inputs">
//             <ul className="flows">
//                 {flowInputs.map(x => (
//                     <li className="port" key={x.uniqueId}>
//                         <InputFlowPortView port={x} />
//                     </li>
//                 ))}
//             </ul>
//             <ul className="values">
//                 {valueInputs.map(x => (
//                     <li className="port" key={x.uniqueId}>
//                         <InputValuePortView port={x} />
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// const OutputList = ({
//     flowOutputs,
//     valueOutputs
// }: {
//     flowOutputs: Array<OutputFlowPort>;
//     valueOutputs: Array<OutputValuePort>;
// }) => {
//     return (
//         <div className="outputs">
//             <ul className="flows">
//                 {flowOutputs.map(x => (
//                     <li className="port" key={x.uniqueId}>
//                         <OutputFlowPortView port={x} />
//                     </li>
//                 ))}
//             </ul>
//             <ul className="values">
//                 {valueOutputs.map(x => (
//                     <li className="port" key={x.uniqueId}>
//                         <OutputValuePortView port={x} />
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

type NodeViewProps = { node: Node; component: any, bindControl: Function; bindSocket: Function };
export default class NodeView extends React.Component<NodeViewProps> {

    public render() {
        const { node, bindSocket, component } = this.props;
        const { inputs, outputs } = node;

        return (
            <div className="node">
                <div className="header">
                    <span className="title">{component.title}</span>
                </div>
                <div className="content">
                    <div className="inputs">
                        {inputs &&
                            Array.from(inputs.values()).map(x => (
                                <div className="label-input" key={x.key}>
                                    <SocketView
                                        bindSocket={bindSocket}
                                        io={x}
                                        type="input"
                                    />
                                    <span>{x.name}</span>
                                </div>
                            ))}
                    </div>
                    <div className="outputs">
                        {outputs &&
                            Array.from(outputs.values()).map(x => (
                                <div className="label-output" key={x.key}>
                                    <span>{x.name}</span>
                                    <SocketView
                                        key={x.key}
                                        bindSocket={bindSocket}
                                        io={x}
                                        type="output"
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }
}
