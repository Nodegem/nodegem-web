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

const EDITOR_KEY_MAP = {

}

const node = new Node("hello", "Math.Subtract");
node.allPorts.push(new InputFlowPort("input"));
node.allPorts.push(new InputValuePort("input v"));
node.allPorts.push(new OutputFlowPort("output"));
node.allPorts.push(new OutputValuePort("output v"));
store.nodes.push(node);

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

                        </g>
                        <g id="_nodes">
                            <NodeView node={node} defaultWidth={200} />
                        </g>
                    </GraphView>
                </HotKeys>
            </div>
        )
    }

}

export default FlowEditor;