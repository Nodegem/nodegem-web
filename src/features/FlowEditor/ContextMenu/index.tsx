import * as React from 'react';
import { ContextMenu, MenuItem } from 'react-contextmenu';
import { action } from 'mobx';
import './context-menu.scss';
import { flowEditorStore } from '../store/flow-editor-store';
import { observer } from 'mobx-react';
import { Input, Icon } from 'antd';
import { run } from '../hubs/graph-hub';
import { transformGraph } from '../services/data-transform/run-graph';

export enum MenuType {
    GRAPH_MENU = 'graph-menu',
    NODE_MENU = 'node-menu',
    LINK_MENU = 'link-menu'
}

const getParentPosition = (target: Element) : XYCoords => {
    const clientRect = target.parentElement!.getBoundingClientRect() as DOMRect;
    return [clientRect.x, clientRect.y];
}

const onShow = action(() => {
    flowEditorStore.isContextVisible = true;
})

const onHide = action(() => {
    flowEditorStore.isContextVisible = false;
})

const commonProps = { onShow: onShow, onHide: onHide, hideOnLeave: true };

const handleNodeClick = (e, data) => {
    flowEditorStore.removeNode(data.node);
}

const NodeContextMenu = () => {
    return (
        <ContextMenu id={MenuType.NODE_MENU} {...commonProps}>
            <MenuItem onClick={handleNodeClick}>
                <Icon type="delete" />Delete
            </MenuItem>
        </ContextMenu>
    )
}

const handleGraphClick = (e, data) => {
    const position = getParentPosition(e.target);
    flowEditorStore.buildAndAddNode(data, position)
}

@observer
class GraphContextMenu extends React.Component<{}, { search: string }> {

    state = {
        search: ""
    }

    private renderDefinitions = (definitions: Array<NodeDefinition>) : JSX.Element[] => {
        return definitions.map((nd, index) => 
            <MenuItem key={index} onClick={handleGraphClick} data={nd}>
                {nd.title}
            </MenuItem>
        );
    }

    private onChange = (e) => {
        this.setState({ search: e.target.value });
    }

    private onHide = () => {
        this.setState({
            search: ""
        });
        commonProps.onHide();
    }

    private onRunClick = () => {
        run(transformGraph(flowEditorStore.nodes, flowEditorStore.links));
    }

    private onClearClick = () => {
        flowEditorStore.clearGraph();
    }

    public render()
    {
        const nodeDefinitions = flowEditorStore.definitionList || [];
        const { onHide, ...rest } = commonProps;
        const { search } = this.state;
        return (
            <ContextMenu id={MenuType.GRAPH_MENU} onHide={this.onHide} {...rest}>
                {
                    nodeDefinitions.length > 0 
                        ? (
                            <>
                                <Input className="node-search" placeholder="Search..." onChange={this.onChange} value={search} />
                                {this.renderDefinitions(nodeDefinitions)}
                                <MenuItem divider />
                                <MenuItem onClick={this.onRunClick}><Icon type="play-circle" />Run Graph</MenuItem>
                                <MenuItem onClick={this.onClearClick}><Icon type="delete" />Clear Graph</MenuItem>
                            </>
                        )
                        : <>Loading Nodes...</>
                }
            </ContextMenu>
        );
    }
}

export const AllContextMenus = () =>
    <>
        <NodeContextMenu />
        <GraphContextMenu />
    </>