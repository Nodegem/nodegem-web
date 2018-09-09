import * as React from 'react';
import * as d3 from 'd3';
import { Graph } from './Graph';
import { observer } from 'mobx-react';

import "./Graph.scss";

interface GraphViewProps {
    graph: Graph;
    zoomRange: [number, number];
    size: [number, number];
    pattern: Pattern;
    onRightClick?: (e: React.MouseEvent) => void;
}

@observer
class GraphView extends React.Component<GraphViewProps> {

    static defaultProps : Partial<GraphViewProps> = {
        onRightClick: () => {}
    }

    componentDidMount() {
        this.props.graph.initialize(this.props.size, this.props.zoomRange);
    }

    public render() {

        const { graph, pattern, size, onRightClick } = this.props;

        const [width, height] = size;
        const [halfWidth, halfHeight] = [width/2, height/2];

        return (
            <svg className="graph" id="_graph">
                <defs>
                    {pattern.pattern}
                </defs>
                <g id="_graph-view" transform={d3.zoomIdentity.toString()}>
                    <rect x={-halfWidth} y={-halfHeight} 
                            width={width} height={height} 
                            className="graph-background"
                            onContextMenu={onRightClick} 
                            style={{ fill: (pattern.patternId ? `url("${pattern.patternId}")` : "none") }} />
                        { graph.mounted && this.props.children }
                </g>
            </svg>
        );
    }

}

export { GraphView }