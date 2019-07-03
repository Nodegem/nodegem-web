import { Button, Icon } from 'antd';
import * as React from 'react';

interface IAddItemProps {
    ioType: IOType;
    onClick: (ioType: IOType) => void;
}

class AddItem extends React.Component<IAddItemProps> {
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
