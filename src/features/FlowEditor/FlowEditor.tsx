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
import { DrawValueLinkView, ValueLinkView, FlowLinkView, FlowMarker, DrawFlowLinkView } from './Link/LinkView';
import { ValueLink } from './Link';
import { transformGraph } from './utils/data-transform/data-transform';

const EDITOR_KEY_MAP = {
    'test': ["ctrl+k"]
}

const node = new Node("hello", "Math.Subtract", [500, 250]);
node.allPorts.push(new InputFlowPort(node, "input", "i"));
node.allPorts.push(new InputValuePort(node, "input v", "ib", 1));
node.allPorts.push(new OutputFlowPort(node, "output", "sdasd"));
node.allPorts.push(new OutputValuePort(node, "output v", "sdasdadas"));
store.nodes.push(node);

const node2 = new Node("Goodbye", "Math.Subtract", [500, 500]);
node2.allPorts.push(new InputFlowPort(node2, "input", "sda"));
node2.allPorts.push(new InputValuePort(node2, "input v", "d", 1));
node2.allPorts.push(new OutputFlowPort(node2, "output", "asdasdas"));
node2.allPorts.push(new OutputValuePort(node2, "output v", "sdasdadasda"));
store.nodes.push(node2);

const AdditionalDefs = ({}) => {
    return (
        <FlowMarker />
    )
}

@observer
class FlowEditor extends React.Component {

    public render() {

        const hotkeyHandler = {
            'test': (event) => { event.preventDefault(); console.log(transformGraph(store.nodes, store.links)); }
        };

        let source : XYCoords = [0, 0];
        let destination : XYCoords = [0, 0];

        if(!!store.linking) {
            const link = store.linking;
            if(link.from.ioType === "output") {
                source = link.sourcePos;
                destination = store.graph.mousePosition;
            } else {
                destination = link.sourcePos;
                source = store.graph.mousePosition;
            }
        }

        return (
            <div className="flow-editor">
                <HotKeys keyMap={EDITOR_KEY_MAP} handlers={hotkeyHandler} style={{flex: "inherit"}}>
                    <GraphView size={[15000, 15000]} pattern={canvasPattern(200)} graph={store.graph} zoomRange={[.5, 1.5]} defs={<AdditionalDefs />}>
                        <g id="_connections">
                            {
                                store.links.map(x => {
                                    const returnElement = x instanceof ValueLink
                                        ? <ValueLinkView key={x.id} link={x} />
                                        : <FlowLinkView key={x.id} link={x} />;
                                    return returnElement;
                                })
                            }
                            {
                                store.linking 
                                    && (
                                        store.linking.from.type === "flow" 
                                        ? <DrawFlowLinkView sourcePos={source} destPos={destination} />
                                        : <DrawValueLinkView sourcePos={source} destPos={destination} />
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