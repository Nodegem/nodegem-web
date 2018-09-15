import * as React from 'react';
import { observer } from 'mobx-react';
import { HotKeys } from 'react-hotkeys';
import { canvasPattern } from './Patterns';
import { NodeView, Node } from './Node';
import { store } from './store/store';
import { GraphView } from './Graph/GraphView';
import { DrawValueLinkView, ValueLinkView, FlowLinkView, FlowMarker, DrawFlowLinkView } from './Link/LinkView';
import { ValueLink } from './Link';
import { createNodeFromDefinition } from './utils/data-transform/node-definition';
import { transformGraph } from './utils/data-transform/data-transform';
import { graphService } from './services/graph-service';
import { InputValuePort, OutputValuePort } from './Node/Ports';
import _ from 'lodash';

import "./FlowEditor.scss";

const AdditionalDefs = ({}) => {
    return (
        <FlowMarker />
    )
}

const EDITOR_KEY_MAP = {
    'test': ["ctrl+k", "command+k"],
    'run': ["ctrl+enter", "command+enter"],
    'center': ["space"],
    'clear': ["ctrl+backspace", "command+backspace"]
}

@observer
class FlowEditor extends React.Component {

    public render() {

        const hotkeyHandler = {
            'test': (event) => { 
                event.preventDefault();
                console.log(store.nodeDefinitions);

                const start = store.nodeDefinitions[4];
                const log = store.nodeDefinitions[0];
                const add = store.nodeDefinitions[2];
                const sendText = store.nodeDefinitions[1];
                store.nodes.push(createNodeFromDefinition(start, [200, 200]))
                store.nodes.push(createNodeFromDefinition(add, [250, 250]))
                store.nodes.push(createNodeFromDefinition(add, [300, 300]))
                store.nodes.push(createNodeFromDefinition(log, [400, 400]))
                store.nodes.push(createNodeFromDefinition(sendText, [450, 450]))
            },
            'run': (event) => {
                event.preventDefault();
                const graphData = transformGraph(store.nodes, store.links);
                graphService.runGraph(graphData);
            },
            'center': (event) => {
                store.graph.reset();
            },
            'clear': (event) => {
                event.preventDefault();
                store.clear();
            }
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

        const flexStyles : React.CSSProperties = { flex: "inherit", flexDirection: "column", display: "inherit" };
        return (
            <div className="flow-editor">
                <HotKeys keyMap={EDITOR_KEY_MAP} handlers={hotkeyHandler} style={flexStyles}>
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