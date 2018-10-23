import * as React from "react";
import { Node } from "src/features/Editor 3.0/rete-engine/node";
import "./NodeView.less";

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

type NodeViewProps = { node: Node, bindControl: any, bindSocket: any };
export default class NodeView extends React.Component<NodeViewProps> {

    componentDidMount() {
        const { bindControl, bindSocket } = this.props;
        console.log(bindControl);
        bindControl();
    }

    public render() {

        const { node } = this.props;
        const { inputs, outputs } = node;

        return (
            <div className="node">
                <div className="header">
                    <span className="title">{node.name}</span>
                </div>
                <div className="content">
                    <div className="ports">
                        {
                            inputs && Array.from(inputs.values()).map(x => 
                                null
                            )
                        }
                        {/* {node.numInputs > 0 && (
                            <InputList
                                flowInputs={node.inputFlowPorts}
                                valueInputs={node.inputValuePorts}
                            />
                        )}
                        {node.numOutputs > 0 && (
                            <OutputList
                                flowOutputs={node.outputFlowPorts}
                                valueOutputs={node.outputValuePorts}
                            />
                        )} */}
                    </div>
                </div>
            </div>
        );
    }
}