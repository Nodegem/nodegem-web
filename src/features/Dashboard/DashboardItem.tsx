import * as React from "react";
import { Card, Tooltip, Icon } from "antd";
import { Meta } from "antd/lib/list/Item";

const dashActions = (item, onBuild: (item) => void, onEdit: (item) => void, onDelete: (item) => void) => [
    (
        <Tooltip title="Build">
            <Icon type="build" theme="twoTone" onClick={() => onBuild(item)} />
        </Tooltip>
    ),
    (
        <Tooltip title="Edit">
            <Icon type="edit" theme="twoTone" onClick={() => onEdit(item)} />
        </Tooltip>
    ),
    (
        <Tooltip title="Delete">
            <Icon type="delete" theme="twoTone" onClick={() => onDelete(item)} />
        </Tooltip>
    )
]

type Item = { name: string, description: string }
interface DashboardItemProps { item: Item, onBuild: (item) => void, onEdit: (item) => void, onDelete: (item) => void }
export const DashboardItem : React.SFC<DashboardItemProps> = props => {
    
    const { item, onBuild, onEdit, onDelete } = props;

    return (
        <Card
            title={item.name}
            actions={dashActions(item, onBuild, onEdit, onDelete)}
        >
            <Meta
                description={item.description}
            />
        </Card>
    )
}