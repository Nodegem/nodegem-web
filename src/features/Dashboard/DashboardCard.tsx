import { Card, Icon, Popconfirm, Tooltip } from 'antd';
import * as React from 'react';

interface IDashboardCardProps {
    item: Graph;
    type: GraphType;
    onDelete: (item: Graph, type: GraphType) => void;
    onEdit: (item: Graph, type: GraphType) => void;
    onBuild: (item: Graph, type: GraphType) => void;
}

class DashboardCard extends React.Component<IDashboardCardProps> {
    public onDelete = () => {
        const { item, onDelete, type } = this.props;
        onDelete(item, type);
    };

    public onEdit = () => {
        const { item, onEdit, type } = this.props;
        onEdit(item, type);
    };

    public onBuild = () => {
        const { item, onBuild, type } = this.props;
        onBuild(item, type);
    };

    public render() {
        const { item } = this.props;

        const iconStyle: React.CSSProperties = { fontSize: 19 };

        return (
            <Card
                title={item.name}
                actions={[
                    <Tooltip title="Edit">
                        <div>
                            <Icon
                                type="tool"
                                theme="filled"
                                style={iconStyle}
                            />
                        </div>
                    </Tooltip>,
                    <Tooltip title="Settings">
                        <div onClick={this.onEdit}>
                            <Icon
                                type="setting"
                                theme="filled"
                                style={iconStyle}
                            />
                        </div>
                    </Tooltip>,
                    <div>
                        <Popconfirm
                            title="Are you sure you want to delete?"
                            onConfirm={this.onDelete}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Icon
                                type="delete"
                                theme="twoTone"
                                twoToneColor="#FF5A5A"
                                style={iconStyle}
                            />
                        </Popconfirm>
                    </div>,
                ]}
            >
                <Card.Meta description={item.description} />
            </Card>
        );
    }
}

export default DashboardCard;
