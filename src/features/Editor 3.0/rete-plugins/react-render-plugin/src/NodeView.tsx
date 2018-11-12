import * as React from "react";
import { Node } from "src/features/Editor 3.0/rete-engine/node";
import "./Node.less";
import SocketView from "./SocketView";

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

type NodeViewProps = { node: Node; component: any, bindSocket: Function; bindControl: Function };
export default class NodeView extends React.Component<NodeViewProps> {

    public render() {
        const { node, bindSocket, component, bindControl } = this.props;
        const { inputs, outputs } = node;

        return (
            <div className="node">
                <div className="header">
                    <span className="title">{component.title}</span>
                </div>
                <div className="content">
                    {
                        inputs.size > 0 && 
                        <div className="inputs">
                        {
                            Array.from(inputs.values()).map(x => {
                                return (
                                    <div className="label-input" key={x.key}>
                                        <SocketView
                                            bindSocket={bindSocket}
                                            io={x}
                                            type="input"
                                        />
                                        <span>{x.name}</span>
                                    </div>
                                )
                            })
                        }
                        </div>
                    }
                    {
                        outputs.size > 0 &&
                        <div className="outputs">
                        {
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
                                ))
                        }
                        </div>
                    }
                </div>
            </div>
        );
    }
}
