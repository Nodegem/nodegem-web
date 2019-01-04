import './macro-modal-form.less';

import { Collapse, Form, Input, Divider, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { inject, observer } from 'mobx-react';
import * as React from 'react';
import ModalForm, {
    FieldDecorator,
    ModalFormProps,
} from 'src/components/ModalForm/ModalForm';

import { MacroModalStore } from './macro-modal-store';
import MacroIOField from 'src/components/MacroIOField/MacroIOField';
import AddItem from './AddItem';

const Panel = Collapse.Panel;

interface ModalProps extends ModalFormProps {
    onSave?: (macro: Macro | undefined) => void;
    macroModalStore?: MacroModalStore;
}

@inject('macroModalStore')
@observer
class MacroModalForm extends React.Component<ModalProps> {
    private formRef: Form;

    handleSubmit = async () => {
        const { macroModalStore } = this.props;
        const { form } = this.formRef.props;

        form!.validateFields(async (err, values) => {
            if (err) {
                notification.error({
                    message: 'Unable To Save Macro',
                    description:
                        'Invalid data. Delete any empty inputs/outputs.',
                });
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
        this.props.macroModalStore!.closeModal();
    };

    private validateField = (rule, value, callback) => {
        if (!value.label) {
            callback('Label cannot be empty');
            return;
        }

        callback();
    };

    private renderFields(
        fd: FieldDecorator,
        key: keyof Macro,
        dataList: any[],
        ioType: IOType
    ) {
        const list = dataList || [];
        return list.map((i, index) => (
            <Form.Item key={index}>
                {fd(`${key}[${index}]`, {
                    initialValue: {
                        label: i.label,
                        type: i.type,
                    },
                    rules: [
                        {
                            validator: this.validateField,
                        },
                    ],
                })(
                    <MacroIOField
                        index={index}
                        ioType={ioType}
                        onDelete={this.onItemRemove}
                    />
                )}
            </Form.Item>
        ));
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

    private onItemAdd = (ioType: IOType) => {
        const { macroModalStore } = this.props;

        switch (ioType) {
            case 'flowInput':
                macroModalStore!.addNewFlowInput();
                break;
            case 'flowOutput':
                macroModalStore!.addNewFlowOutput();
                break;
            case 'valueInput':
                macroModalStore!.addNewValueInput();
                break;
            case 'valueOutput':
                macroModalStore!.addNewValueOutput();
                break;
        }
    };

    private onItemRemove = (ioType: IOType, index: number) => {
        const { macroModalStore } = this.props;
        switch (ioType) {
            case 'flowInput':
                macroModalStore!.removeFlowInput(index);
                break;
            case 'flowOutput':
                macroModalStore!.removeFlowOutput(index);
                break;
            case 'valueInput':
                macroModalStore!.removeValueInput(index);
                break;
            case 'valueOutput':
                macroModalStore!.removeValueOutput(index);
                break;
        }
    };

    public render() {
        const { children, macroModalStore, onSave, ...rest } = this.props;
        const {
            saving,
            editMode,
            data,
            isVisible,
            parentKey,
            inputKey,
            outputKey,
            flowInputs,
            flowOutputs,
            valueInputs,
            valueOutputs,
        } = macroModalStore!;

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
                        <Form.Item label="Name">
                            {fd<Macro>('name', {
                                initialValue: data.name,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Name is required',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="Description" required>
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
                        </Form.Item>
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
                                            {this.renderFields(
                                                fd,
                                                'flowInputs',
                                                flowInputs,
                                                'flowInput'
                                            )}
                                            <AddItem
                                                ioType="flowInput"
                                                onClick={this.onItemAdd}
                                            />
                                        </>
                                    </Panel>
                                    <Panel header="Value" key="2">
                                        <>
                                            {this.renderFields(
                                                fd,
                                                'valueInputs',
                                                valueInputs,
                                                'valueInput'
                                            )}
                                            <AddItem
                                                ioType="valueInput"
                                                onClick={this.onItemAdd}
                                            />
                                        </>
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
                                        <>
                                            {this.renderFields(
                                                fd,
                                                'flowOutputs',
                                                flowOutputs,
                                                'flowOutput'
                                            )}
                                            <AddItem
                                                ioType="flowOutput"
                                                onClick={this.onItemAdd}
                                            />
                                        </>
                                    </Panel>
                                    <Panel header="Value" key="2">
                                        <>
                                            {this.renderFields(
                                                fd,
                                                'valueOutputs',
                                                valueOutputs,
                                                'valueOutput'
                                            )}
                                            <AddItem
                                                ioType="valueOutput"
                                                onClick={this.onItemAdd}
                                            />
                                        </>
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
