import * as React from 'react';
import { observer } from 'mobx-react';
import { HotKeys } from 'react-hotkeys';
import { canvasPattern } from './Patterns';
import { NodeView } from './Node';
import { store } from './store/store';
import { GraphView } from './Graph/GraphView';
import { DrawValueLinkView, ValueLinkView, FlowLinkView, FlowMarker, DrawFlowLinkView } from './Link/LinkView';
import { ValueLink } from './Link';
import { createNodeFromDefinition } from './utils/data-transform/node-definition';
import _ from 'lodash';

import "./FlowEditor.scss";

const AdditionalDefs = ({}) => {
    return (
        <FlowMarker />
    )
}

const EDITOR_KEY_MAP = {
    'test': ["ctrl+k"]
}

@observer
class FlowEditor extends React.Component {

    public render() {

        const hotkeyHandler = {
            'test': (event) => { 
                event.preventDefault();
                console.log("create graph scene")
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