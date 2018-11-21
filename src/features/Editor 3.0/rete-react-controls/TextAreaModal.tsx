import * as React from 'react';
import { Button, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

interface TextAreaModalProps { 
    title: string;
    label: string;
    onChange: (value: any) => void;
    value: any;
}

class TextAreaModal extends React.Component<TextAreaModalProps, { isOpen: boolean, value: string }> {

    state = {
        isOpen: false,
        value: ""
    }

    private handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    private showModal = () => {
        const { value } = this.props;
        this.setState({ isOpen: true, value: value });
    }

    private handleOk = () => {
        this.setState({ isOpen: false });
        this.props.onChange(this.state.value);
    }

    private handleCancel = () => {
        this.setState({ isOpen: false });
    }

    public render() {

        const { title, label } = this.props;
        const { isOpen } = this.state;

        return (
            <div>
                <Button size="small" type="primary" onClick={this.showModal}>
                    Edit Text
                </Button>
                <Modal
                    title={title}
                    visible={isOpen}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    centered
                >
                    <TextArea onChange={this.handleChange} placeholder={label} value={this.state.value} rows={6} cols={6} />
                </Modal>
            </div>
        );
    }

}

export { TextAreaModal };