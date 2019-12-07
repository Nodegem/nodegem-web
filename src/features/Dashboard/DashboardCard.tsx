import { Card, Icon, Popconfirm, Tooltip, Dropdown, Menu } from 'antd';
import * as React from 'react';
import { appStore } from 'stores';

interface IDashboardCardProps {
    item: Graph;
    type: GraphType;
    onDelete: (item: Graph, type: GraphType) => void;
    onEdit: (item: Graph, type: GraphType) => void;
    onBuild: (item: Graph, type: GraphType) => void;
}

const iconStyle: React.CSSProperties = { fontStyle: '1em' };

interface OptionProps {
    item: Graph;
    type: GraphType;
    onDelete: (item: Graph, type: GraphType) => void;
}

const MoreOptions: React.FC<OptionProps> = ({ item, type, onDelete }) => (
    <Menu theme="dark" selectable={false}>
        <Menu.Item>
            <Icon type="copy" style={iconStyle} />
            Duplicate
        </Menu.Item>
        <Menu.Item
            onClick={() => {
                appStore.showConfirmation(
                    `Are you sure you want to delete ${item.name}?`,
                    'This action cannot be reversed',
                    () => {
                        onDelete(item, type);
                    }
                );
            }}
            className="dangerous"
        >
            <Icon type="delete" style={iconStyle} />
            Delete
        </Menu.Item>
    </Menu>
);

class DashboardCard extends React.Component<IDashboardCardProps> {
    public onDelete = () => {
        const { item, onDelete, type } = this.props;
        onDelete(item, type);
    };

    public onSettings = () => {
        const { item, onEdit, type } = this.props;
        onEdit(item, type);
    };

    public onEdit = () => {
        const { item, onBuild, type } = this.props;
        onBuild(item, type);
    };

    public render() {
        const { item, type } = this.props;

        return (
            <Card
                title={item.name}
                actions={[
                    <Tooltip title="Edit">
                        <div onClick={this.onEdit}>
                            <Icon
                                type="tool"
                                theme="filled"
                                style={iconStyle}
                            />
                        </div>
                    </Tooltip>,
                    <Tooltip title="Settings">
                        <div onClick={this.onSettings}>
                            <Icon
                                type="setting"
                                theme="filled"
                                style={iconStyle}
                            />
                        </div>
                    </Tooltip>,
                    <Dropdown
                        placement="topLeft"
                        overlay={
                            <MoreOptions
                                item={item}
                                type={type}
                                onDelete={this.onDelete}
                            />
                        }
                    >
                        <Icon type="more" />
                    </Dropdown>,
                ]}
            >
                <Card.Meta description={item.description} />
            </Card>
        );
    }
}

export default DashboardCard;
