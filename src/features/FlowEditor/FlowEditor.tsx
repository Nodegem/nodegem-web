import * as React from 'react';
import { observer } from 'mobx-react';
import { HotKeys } from 'react-hotkeys';
import { canvasPattern } from './Patterns';
import _ from 'lodash';

import "./FlowEditor.scss";
import { Node, NodeView } from './Node';
import { store } from './store/store';
import { GraphView } from './Graph/GraphView';
import { InputFlowPort, OutputFlowPort } from './Node/Ports/FlowPort';
import { InputValuePort, OutputValuePort } from './Node/Ports/ValuePort';
import { DrawValueLinkView } from './Link/LinkView';

const EDITOR_KEY_MAP = {

}

const node = new Node("hello", "Math.Subtract", [500, 250]);
node.allPorts.push(new InputFlowPort(node, "input"));
node.allPorts.push(new InputValuePort(node, "input v"));
node.allPorts.push(new OutputFlowPort(node, "output"));
node.allPorts.push(new OutputValuePort(node, "output v"));
store.nodes.push(node);

const node2 = new Node("Goodbye", "Math.Subtract", [500, 500]);
node2.allPorts.push(new InputFlowPort(node, "input"));
node2.allPorts.push(new InputValuePort(node, "input v"));
node2.allPorts.push(new OutputFlowPort(node, "output"));
node2.allPorts.push(new OutputValuePort(node, "output v"));
store.nodes.push(node2);

@observer
class FlowEditor extends React.Component {

    public render() {

        const hotkeyHandler = {

        }

        return (
            <div className="flow-editor">
                <HotKeys keyMap={EDITOR_KEY_MAP} handlers={hotkeyHandler} style={{flex: "inherit"}}>
                    <GraphView size={[15000, 15000]} pattern={canvasPattern(200)} graph={store.graph} zoomRange={[.5, 1.5]}>
                        <g id="_connections">
                            {
                                store.linking 
                                    && (
                                        store.linking.from.type === "flow" 
                                        ? <></>
                                        : <DrawValueLinkView sourcePos={store.linking.sourcePos} destPos={store.graph.mousePosition} />
                                    )
                            }
                        </g>
                        <g id="_nodes">
                            {store.nodes.map(x => 
                                <NodeView key={x.id} node={x} defaultWidth={200} />    
                            )}
                        </g>
                    </GraphView>
                </HotKeys>
            </div>
        )
    }

}

export default FlowEditor;