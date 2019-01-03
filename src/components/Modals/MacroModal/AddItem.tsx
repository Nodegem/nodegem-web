import * as React from 'react';
import { Button, Icon } from 'antd';

interface AddItemProps {
    ioType: IOType;
    onClick: (ioType: IOType) => void;
}

class AddItem extends React.Component<AddItemProps> {
    private onClick = () => {
        this.props.onClick(this.props.ioType);
    };

    public render() {
        return (
            <Button block type="dashed" onClick={this.onClick}>
                <Icon type="plus" /> Add Field
            </Button>
        );
    }
}

export default AddItem;
