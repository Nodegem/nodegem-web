import * as React from 'react';
import { observer } from 'mobx-react';
import { HotKeys } from 'react-hotkeys';
import { canvasPattern } from './Patterns';
import { NodeView } from './Node';
import { flowEditorStore } from './store/flow-editor-store';
import { GraphView } from './Graph/GraphView';
import { DrawValueLinkView, ValueLinkView, FlowLinkView, FlowMarker, DrawFlowLinkView } from './Link/LinkView';
import { ValueLink } from './Link';
import { graphService } from './services/graph-service';
import FlowContextMenuView from './FlowContextMenu/FlowContextMenuView';
import { transformGraph } from './services/data-transform/run-graph';
import { Terminal } from 'xterm';
import { XTerm } from './Terminal/XTerm';
import { stopListeningToTerminal, startListeningToTerminalHub, subscribeToTerminal } from './hubs/terminal-hub';
import { startConnectionToFlowGraph, run } from './hubs/graph-hub';
import _ from 'lodash';
import moment from 'moment';

import "./FlowEditor.scss";

const AdditionalDefs = ({ }) => {
    return (
        <FlowMarker />
    )
}

const EDITOR_KEY_MAP = {
    'run': ["ctrl+enter", "command+enter"],
    'center': ["ctrl+space"],
    'clear': ["ctrl+backspace", "command+backspace"],
    'new': ["ctrl+shift+n"],
    'save': ["ctrl+s", "command+s"],
    'load': ["ctrl+l", "command+l"]
}

@observer
class FlowEditor extends React.Component {

    private terminal: XTerm;

    public componentDidMount() {
        startConnectionToFlowGraph(() => {});
        startListeningToTerminalHub(() => {});
        runTerminal(this.terminal);
    }

    public componentWillUnmount() {
        stopListeningToTerminal();
    }

    public render() {

        const hotkeyHandler = {
            'run': (event) => {
                event.preventDefault();
                run(transformGraph(flowEditorStore.nodes, flowEditorStore.links));
            },
            'center': (event) => {
                event.preventDefault();
                flowEditorStore.graph.reset();
            },
            'clear': (event) => {
                event.preventDefault();
                flowEditorStore.clearGraph();
            },
            'new': (event) => {
                event.preventDefault();
                flowEditorStore.saveGraph();
            },
            'save': (event) => {
                event.preventDefault();
            },
            'load': (event) => {
                event.preventDefault();
                flowEditorStore.loadGraph();
            }
        };

        let source: XYCoords = [0, 0];
        let destination: XYCoords = [0, 0];

        const { mounted } = flowEditorStore.graph;

        if (!!flowEditorStore.linking) {
            const link = flowEditorStore.linking;
            if (link.from.ioType === "output") {
                source = link.sourcePos;
                destination = flowEditorStore.graph.mousePosition;
            } else {
                destination = link.sourcePos;
                source = flowEditorStore.graph.mousePosition;
            }
        }

        const flexStyles: React.CSSProperties = { flex: "inherit", flexDirection: "column", display: "inherit" };
        return (
            <div className="flow-editor">
                <HotKeys keyMap={EDITOR_KEY_MAP} handlers={hotkeyHandler} style={flexStyles}>
                    <GraphView size={[15000, 15000]} pattern={canvasPattern(200)} graph={flowEditorStore.graph} zoomRange={[.5, 1.5]} defs={<AdditionalDefs />}>
                        <g id="_connections">
                            {
                                mounted
                                && flowEditorStore.links.map(x => {
                                    const returnElement = x instanceof ValueLink
                                        ? <ValueLinkView key={x.id} link={x} />
                                        : <FlowLinkView key={x.id} link={x} />;
                                    return returnElement;
                                })
                            }
                            {
                                flowEditorStore.linking
                                && (
                                    flowEditorStore.linking.from.type === "flow"
                                        ? <DrawFlowLinkView sourcePos={source} destPos={destination} />
                                        : <DrawValueLinkView sourcePos={source} destPos={destination} />
                                )
                            }
                        </g>
                        <g id="_nodes">
                            {flowEditorStore.nodes.map(x =>
                                <NodeView key={x.id} node={x} defaultWidth={200} />
                            )}
                        </g>
                    </GraphView>

                </HotKeys>
                <XTerm ref={ref => this.terminal = ref!} options={{ rows: 10, cursorStyle: "underline" }} addons={['fit', 'search']} />
                <FlowContextMenuView />
            </div>
        )
    }

}

function runTerminal(xterm: XTerm) {
    const term: Terminal = xterm.getTerminal();

    subscribeToTerminal(logToTerminal);

    term.writeln('Welcome!');
    term.writeln('');

    function logToTerminal(data) {
        term.writeln(`[${moment().format("LTS")}] - ${data}`);
    }

}

export default FlowEditor;