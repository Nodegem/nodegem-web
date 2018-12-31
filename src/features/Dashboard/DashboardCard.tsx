import { Card, Icon, Popconfirm, Tooltip } from 'antd';
import * as React from 'react';

interface DashboardCardProps {
    item: Graph;
    type: GraphType;
    onDelete: (item: Graph, type: GraphType) => void;
    onEdit: (item: Graph, type: GraphType) => void;
    onBuild: (item: Graph, type: GraphType) => void;
}

class DashboardCard extends React.Component<DashboardCardProps> {
    onDelete = () => {
        const { item, onDelete, type } = this.props;
        onDelete(item, type);
    };

    onEdit = () => {
        const { item, onEdit, type } = this.props;
        onEdit(item, type);
    };

    onBuild = () => {
        const { item, onBuild, type } = this.props;
        onBuild(item, type);
    };

    public render() {
        const { item } = this.props;

        return (
            <Card
                title={item.name}
                actions={[
                    <div onClick={this.onBuild}>
                        <Tooltip title="Build">
                            <Icon type="build" />
                        </Tooltip>
                    </div>,
                    <div onClick={this.onEdit}>
                        <Tooltip title="Edit">
                            <Icon type="edit" />
                        </Tooltip>
                    </div>,
                    <div>
                        <Tooltip title="Delete">
                            <Popconfirm
                                title="Are you sure you want to delete?"
                                onConfirm={this.onDelete}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Icon type="delete" />
                            </Popconfirm>
                        </Tooltip>
                    </div>,
                ]}
            >
                <Card.Meta description={item.description} />
            </Card>
        );
    }
}

export default DashboardCard;
