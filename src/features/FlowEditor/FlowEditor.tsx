import * as React from 'react';
import { observer } from 'mobx-react';
import { HotKeys } from 'react-hotkeys';
import { canvasPattern } from './Patterns';
import { NodeView, Node } from './Node';
import { flowEditorStore } from './store/flow-editor-store';
import { GraphView } from './Graph/GraphView';
import { DrawValueLinkView, ValueLinkView, FlowLinkView, FlowMarker, DrawFlowLinkView } from './Link/LinkView';
import { ValueLink } from './Link';
import { graphService } from './services/graph-service';
import FlowContextMenuView from './FlowContextMenu/FlowContextMenuView';
import { transformGraph } from './services/data-transform/run-graph';
import { Terminal } from 'xterm';
import _ from 'lodash';

import "./FlowEditor.scss";
import { XTerm } from './Terminal/XTerm';

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
        runFakeTerminal(this.terminal);
    }

    public render() {

        const hotkeyHandler = {
            'run': (event) => {
                event.preventDefault();
                const graphData = transformGraph(flowEditorStore.nodes, flowEditorStore.links);
                console.log(graphData);
                graphService.runGraph(graphData);
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
                this.terminal.resize(2, 2);
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
                <XTerm ref={ref => this.terminal = ref!} options={{ rows: 10 }} addons={['fit', 'search']} />
                <FlowContextMenuView />
            </div>
        )
    }

}

function runFakeTerminal(xterm: XTerm) {
    const term: Terminal = xterm.getTerminal();
    var shellprompt = '$ ';

    function prompt() {
        xterm.write('\r\n' + shellprompt);
    };
    xterm.writeln('Welcome to xterm.js');
    xterm.writeln('This is a local terminal emulation, without a real terminal in the back-end.');
    xterm.writeln('Type some keys and commands to play around.');
    xterm.writeln('');
    prompt();

    term.on('key', function (key, ev) {
        var printable = (
            !ev!.altKey && !ev!.ctrlKey && !ev!.metaKey
        );

        if (ev!.keyCode == 13) {
            prompt();
            // } else if (ev.keyCode == 8) {
            //   // Do not delete the prompt
            //   if (term['x'] > 2) {
            //     xterm.write('\b \b');
            //   }
        } else if (printable) {
            xterm.write(key);
        }
    });

    term.on('paste', function (data, ev) {
        xterm.write(data);
    });
}

export default FlowEditor;