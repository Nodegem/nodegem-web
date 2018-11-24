import * as React from "react";
import { Node } from "src/features/Editor/rete-engine/node";
import "./Node.less";
import SocketView from "./SocketView";
import GenericControlView from "./GenericControlView";
import classNames from "classnames";
import { NodeEditor } from "src/features/Editor/rete-engine/editor";

type NodeViewProps = { node: Node, editor: NodeEditor, title: string, bindSocket: Function; bindControl: Function };
export default class NodeView extends React.Component<NodeViewProps> {

    public render() {
        const { node, editor, bindSocket, title, bindControl } = this.props;
        const { inputs, outputs } = node;

        const nodeClasses = classNames({
            "node": true,
            "selected": editor.selected.contains(node)
        })

        return (
            <div className={nodeClasses}>
                <div className="header">
                    <span className="title">{title}</span>
                </div>
                <div className="content">
                    <ul className="outputs">
                    {
                        Array.from(outputs.values()).map(x => (
                            <li className="field output" key={x.key}>
                                <span className="field-label">{x.name}</span>
                                <SocketView
                                    key={x.key}
                                    bindSocket={bindSocket}
                                    io={x}
                                    type="output"
                                />
                            </li>
                        ))
                    }
                    </ul>
                    <ul className="inputs">
                    {
                        Array.from(inputs.values()).map(x => {
                            return (
                                <li className="field input" key={x.key}>
                                    <SocketView
                                        bindSocket={bindSocket}
                                        io={x}
                                        type="input"
                                    />
                                    { (x.control && x.showControl()) ? <GenericControlView bindControl={bindControl} control={x.control} /> : <span className="field-label">{x.name}</span> }
                                </li>
                            )
                        })
                    }
                    </ul>
                </div>
            </div>
        );
    }
}
