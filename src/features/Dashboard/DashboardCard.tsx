import { Card, Icon, Tooltip } from 'antd';
import * as React from 'react';
import { ModalFormType } from 'src/features/Dashboard/dashboard-store';

interface DashboardCardProps {
    item: Graph,
    type: ModalFormType,
    onDelete: (item: Graph, type: ModalFormType) => void,
    onEdit: (item: Graph, type: ModalFormType) => void,
    onBuild: (item: Graph, type: ModalFormType) => void
}

class DashboardCard extends React.Component<DashboardCardProps> {

    onDelete = () => {
        const { item, onDelete, type } = this.props;
        onDelete(item, type);
    }

    onEdit = () => {
        const { item, onEdit, type } = this.props;
        onEdit(item, type);
    }

    onBuild = () => {
        const { item, onBuild, type } = this.props;
        onBuild(item, type);
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