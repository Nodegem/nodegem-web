import './macro-modal-form.less';

import { Button, Collapse, Form, Icon, Input, Switch, Divider } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import ModalForm, {
    FieldDecorator,
    ModalFormProps,
} from 'src/components/ModalForm/ModalForm';

import { MacroModalStore } from './macro-modal-store';
import IOField from 'src/components/MacroIOField/MacroIOField';

const Panel = Collapse.Panel;

interface ModalProps extends ModalFormProps {
    onSave?: (macro: Macro | undefined) => void;
    macroModalStore?: MacroModalStore;
}

const AddItem = ({ onClick }: { onClick: () => void }) => (
    <Button type="dashed" block onClick={onClick}>
        <Icon type="plus" /> Add Field
    </Button>
);

@inject('macroModalStore')
@observer
class MacroModalForm extends React.Component<ModalProps> {
    private formRef: Form;

    handleSubmit = async () => {
        const { macroModalStore } = this.props;
        const { form } = this.formRef.props;

        form!.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            const macro = await macroModalStore!.saveMacro(values);

            if (this.props.onSave) {
                this.props.onSave(macro);
            }

            form!.resetFields();
            macroModalStore!.closeModal();
        });
    };

    handleCancel = () => {
        const { form } = this.formRef.props;

        form!.resetFields();
        this.props.macroModalStore!.resetModal();
        this.props.macroModalStore!.closeModal();
    };

    private renderFields(fd: FieldDecorator) {
        return (
            <FormItem>
                {fd('field', {
                    initialValue: {
                        secret: false,
                        fieldValue: '',
                    },
                })(<IOField />)}
            </FormItem>
        );
    }

    private onParentCollapse = (key: string | string[] | undefined) => {
        this.props.macroModalStore!.setParentKey(key);
    };

    private onInputCollapse = (key: string | string[] | undefined) => {
        this.props.macroModalStore!.setInputKey(key);
    };

    private onOutputCollapse = (key: string | string[] | undefined) => {
        this.props.macroModalStore!.setOutputKey(key);
    };

    public render() {
        const { children, macroModalStore, onSave, ...rest } = this.props;
        const { saving, editMode, data, isVisible } = macroModalStore!;

        const { parentKey, inputKey, outputKey } = macroModalStore!;

        const modalTitle = editMode ? 'Edit Macro' : 'Add Macro';

        let okButton = '';
        if (saving) {
            okButton = editMode ? 'Saving' : 'Adding';
        } else {
            okButton = editMode ? 'Save' : 'Add';
        }

        return (
            <ModalForm
                wrappedComponentRef={f => (this.formRef = f!)}
                modalProps={{
                    title: modalTitle,
                    okText: okButton,
                    okButtonProps: { loading: saving },
                    onOk: this.handleSubmit,
                    onCancel: this.handleCancel,
                    width: 700,
                }}
                visible={isVisible}
                {...rest}
            >
                {fd => (
                    <>
                        <FormItem label="Name">
                            {fd<Macro>('name', {
                                initialValue: data.name,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Name is required',
                                    },
                                ],
                            })(<Input />)}
                        </FormItem>
                        <FormItem label="Description" required>
                            {fd<Macro>('description', {
                                initialValue: data.description,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Description is required',
                                    },
                                ],
                            })(
                                <TextArea
                                    autosize={{ minRows: 3, maxRows: 8 }}
                                />
                            )}
                        </FormItem>
                        <Divider>Inputs / Outputs</Divider>
                        <Collapse
                            className="io-fields"
                            activeKey={parentKey}
                            onChange={this.onParentCollapse}
                        >
                            <Panel header="Inputs" key="1">
                                <Collapse
                                    bordered={false}
                                    activeKey={inputKey}
                                    onChange={this.onInputCollapse}
                                >
                                    <Panel header="Flow" key="1">
                                        <>
                                            {this.renderFields(fd)}
                                            <AddItem onClick={() => {}} />
                                        </>
                                    </Panel>
                                    <Panel header="Value" key="2">
                                        sd
                                    </Panel>
                                </Collapse>
                            </Panel>
                            <Panel header="Outputs" key="2">
                                <Collapse
                                    bordered={false}
                                    activeKey={outputKey}
                                    onChange={this.onOutputCollapse}
                                >
                                    <Panel header="Flow" key="1">
                                        sd
                                    </Panel>
                                    <Panel header="Value" key="2">
                                        sd
                                    </Panel>
                                </Collapse>
                            </Panel>
                        </Collapse>
                    </>
                )}
            </ModalForm>
        );
    }
}

export default MacroModalForm;
