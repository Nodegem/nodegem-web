import { Button, Modal } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import * as React from 'react';

interface ITextAreaModalProps {
    title: string;
    label: string;
    onChange: (value: any) => void;
    value: any;
}

class TextAreaModal extends React.Component<
    ITextAreaModalProps,
    { isOpen: boolean; value: string }
> {
    public state = {
        isOpen: false,
        value: '',
    };

    private handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    private showModal = () => {
        const { value } = this.props;
        this.setState({ isOpen: true, value });
    };

    private closeModal = () => {
        this.setState({ isOpen: false });
    };

    private handleOk = () => {
        this.closeModal();
        this.props.onChange(this.state.value);
    };

    private handleCancel = () => {
        this.closeModal();
    };

    private handleKeyPress = (e: React.KeyboardEvent) => {
        const ctrlHeld = e.ctrlKey || e.metaKey;
        if (ctrlHeld && e.which === 13) {
            this.closeModal();
            this.props.onChange(this.state.value);
        }
    };

    public render() {
        const { title, label } = this.props;
        const { isOpen } = this.state;

        return (
            <div>
                <Button size="small" type="primary" onClick={this.showModal}>
                    {`Edit ${label}`}
                </Button>
                <Modal
                    title={`Edit ${label}`}
                    visible={isOpen}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    centered
                >
                    <TextArea
                        onChange={this.handleChange}
                        placeholder={label}
                        value={this.state.value}
                        rows={6}
                        cols={6}
                        onKeyPress={this.handleKeyPress}
                    />
                </Modal>
            </div>
        );
    }
}

export { TextAreaModal };
