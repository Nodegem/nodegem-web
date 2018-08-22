import CanvasContextMenu from './CanvasContextMenu/CanvasContextMenu';
import ConnectorContextMenu from './ConnectorContextMenu/ConnectorContextMenu';
import NodeContextMenu from './NodeContextMenu/NodeContextMenu';
import { Icon } from 'react-icons-kit';
import React from 'react';

const MenuIcon = ({ icon }) => <span className="icon"><Icon icon={icon}/></span>

export { CanvasContextMenu, ConnectorContextMenu, NodeContextMenu, MenuIcon };