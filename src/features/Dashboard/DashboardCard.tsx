import * as React from "react";
import { Card, Tooltip, Icon } from "antd";

interface DashboardCardProps {
    item: Graph,
    onDelete: (item: Graph) => void,
    onEdit: (item: Graph) => void,
    onBuild: (item: Graph) => void
}

class DashboardCard extends React.Component<DashboardCardProps> {

    onDelete = () => {
        const { item, onDelete } = this.props;
        onDelete(item);
    }

    onEdit = () => {
        const { item, onEdit } = this.props;
        onEdit(item);
    }

    onBuild = () => {
        const { item, onBuild } = this.props;
        onBuild(item);
    }

    public render() {

        const { item } = this.props;

        return (
            <Card
                title={item.name}
                actions={[
                    <Tooltip title="Build">
                        <Icon type="build" onClick={this.onBuild} />
                    </Tooltip>,
                    <Tooltip title="Edit">
                        <Icon type="edit" onClick={this.onEdit} />
                    </Tooltip>,
                    <Tooltip title="Delete">
                        <Icon type="delete" onClick={this.onDelete} />
                    </Tooltip>
                ]}
            >
                <Card.Meta description={item.description} />
            </Card>
        );
    }
}

export default DashboardCard;