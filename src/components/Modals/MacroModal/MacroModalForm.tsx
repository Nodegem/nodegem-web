import './macro-modal-form.less';

import { Collapse, Divider, Form, Input, notification } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

import { FormComponentProps } from 'antd/lib/form';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import Modal, { ModalProps } from 'antd/lib/modal';
import FlowField from 'components/PortFields/FlowField/FlowField';
import ValueTypeField from 'components/PortFields/ValueTypeField/ValueTypeField';
import AddItem from './AddItem';
import { MacroModalStore } from './macro-modal-store';

const Panel = Collapse.Panel;

interface IFormDataProps {
    data: Macro;
    parentKey: string | string[] | undefined;
    inputKey: string | string[] | undefined;
    outputKey: string | string[] | undefined;
    onInputCollapse: (key: string | string[] | undefined) => void;
    onOutputCollapse: (key: string | string[] | undefined) => void;
    onParentCollapse: (key: string | string[] | undefined) => void;
    onItemAdd: (ioType: IOType) => void;
    onItemRemove: (ioType: IOType, id: string) => void;
    valueInputs: Partial<ValueInputFieldDto>[];
    valueOutputs: Partial<ValueOutputFieldDto>[];
    flowInputs: Partial<FlowInputFieldDto>[];
    flowOutputs: Partial<FlowOutputFieldDto>[];
}

const MacroForm = Form.create<IFormDataProps & ModalProps & FormComponentProps>(
    {
        name: 'macro_form',
    }
)(
    class extends React.Component<
        IFormDataProps & ModalProps & FormComponentProps
    > {
        private validateField = (rule, value, callback) => {
            if (!value.label) {
                callback('Label cannot be empty');
                return;
            }
            callback();
        };

        private renderFields(
            fd: <T extends Object = {}>(
                id: keyof T,
                options?: GetFieldDecoratorOptions | undefined
            ) => (node: React.ReactNode) => React.ReactNode,
            key: keyof Macro,
            dataList: any[],
            ioType: IOType,
            onItemRemove: (ioType: IOType, id: string) => void
        ) {
            const list = dataList || [];
            return list.map(i => (
                <Form.Item key={i.key}>
                    {fd(`${key}[${i.key}]`, {
                        initialValue: {
                            label: i.label,
                            type: i.type || 0,
                            defaultValue: i.defaultValue,
                        },
                        rules: [
                            {
                                validator: this.validateField,
                            },
                        ],
                    })(
                        ioType === 'valueInput' || ioType === 'valueOutput' ? (
                            <ValueTypeField
                                fieldKey={i.key}
                                ioType={ioType}
                                onDelete={onItemRemove}
                            />
                        ) : (
                            <FlowField
                                fieldKey={i.key}
                                ioType={ioType}
                                onDelete={onItemRemove}
                            />
                        )
                    )}
                </Form.Item>
            ));
        }

        public render() {
            const {
                form,
                data,
                inputKey,
                outputKey,
                parentKey,
                onInputCollapse,
                onOutputCollapse,
                onParentCollapse,
                onItemAdd,
                onItemRemove,
                valueInputs,
                valueOutputs,
                flowInputs,
                flowOutputs,
                ...rest
            } = this.props;
            const { getFieldDecorator } = form;

            return (
                <Modal {...rest}>
                    <Form layout="vertical">
                        <Form.Item label="Name">
                            {getFieldDecorator<Macro>('name', {
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
                            {getFieldDecorator<Macro>('description', {
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
                            onChange={onParentCollapse}
                        >
                            <Panel header="Inputs" key="1">
                                <Collapse
                                    bordered={false}
                                    activeKey={inputKey}
                                    onChange={onInputCollapse}
                                >
                                    <Panel header="Flow" key="1">
                                        <>
                                            {this.renderFields(
                                                getFieldDecorator,
                                                'flowInputs',
                                                flowInputs,
                                                'flowInput',
                                                onItemRemove
                                            )}
                                            <AddItem
                                                ioType="flowInput"
                                                onClick={onItemAdd}
                                            />
                                        </>
                                    </Panel>
                                    <Panel header="Value" key="2">
                                        <>
                                            {this.renderFields(
                                                getFieldDecorator,
                                                'valueInputs',
                                                valueInputs,
                                                'valueInput',
                                                onItemRemove
                                            )}
                                            <AddItem
                                                ioType="valueInput"
                                                onClick={onItemAdd}
                                            />
                                        </>
                                    </Panel>
                                </Collapse>
                            </Panel>
                            <Panel header="Outputs" key="2">
                                <Collapse
                                    bordered={false}
                                    activeKey={outputKey}
                                    onChange={onOutputCollapse}
                                >
                                    <Panel header="Flow" key="1">
                                        <>
                                            {this.renderFields(
                                                getFieldDecorator,
                                                'flowOutputs',
                                                flowOutputs,
                                                'flowOutput',
                                                onItemRemove
                                            )}
                                            <AddItem
                                                ioType="flowOutput"
                                                onClick={onItemAdd}
                                            />
                                        </>
                                    </Panel>
                                    <Panel header="Value" key="2">
                                        <>
                                            {this.renderFields(
                                                getFieldDecorator,
                                                'valueOutputs',
                                                valueOutputs,
                                                'valueOutput',
                                                onItemRemove
                                            )}
                                            <AddItem
                                                ioType="valueOutput"
                                                onClick={onItemAdd}
                                            />
                                        </>
                                    </Panel>
                                </Collapse>
                            </Panel>
                        </Collapse>
                    </Form>
                </Modal>
            );
        }
    }
);

@inject('macroModalStore')
@observer
class MacroModalFormController extends React.Component<{
    macroModalStore?: MacroModalStore;
    onSave?: (macro: Macro | undefined, edit: boolean) => void;
}> {
    private formRef: Form;

    public handleSubmit = async () => {
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
                this.props.onSave(macro, macroModalStore!.editMode);
            }

            form!.resetFields();
            macroModalStore!.closeModal();
        });
    };

    public handleCancel = () => {
        const { form } = this.formRef.props;

        form!.resetFields();
        this.props.macroModalStore!.closeModal();
    };

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

        this.forceUpdate();
    };

    private onItemRemove = (ioType: IOType, id: string) => {
        const { macroModalStore } = this.props;
        switch (ioType) {
            case 'flowInput':
                macroModalStore!.removeFlowInput(id);
                break;
            case 'flowOutput':
                macroModalStore!.removeFlowOutput(id);
                break;
            case 'valueInput':
                macroModalStore!.removeValueInput(id);
                break;
            case 'valueOutput':
                macroModalStore!.removeValueOutput(id);
                break;
        }
        this.forceUpdate();
    };

    public saveFormRef = formRef => {
        this.formRef = formRef;
    };

    public render() {
        const { macroModalStore } = this.props;
        const {
            saving,
            editMode,
            modalData: data,
            isVisible,
            parentKey,
            inputKey,
            outputKey,
            valueInputs,
            valueOutputs,
            flowInputs,
            flowOutputs,
        } = macroModalStore!;

        const modalTitle = editMode ? 'Edit Macro Settings' : 'Add Macro';

        let okButton = '';
        // tslint:disable-next-line: prefer-conditional-expression
        if (saving) {
            okButton = editMode ? 'Saving' : 'Adding';
        } else {
            okButton = editMode ? 'Save' : 'Add';
        }

        return (
            <MacroForm
                wrappedComponentRef={this.saveFormRef}
                title={modalTitle}
                okText={okButton}
                okButtonProps={{ loading: saving }}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                width={1000}
                visible={isVisible}
                data={data}
                parentKey={parentKey}
                inputKey={inputKey}
                outputKey={outputKey}
                onInputCollapse={this.onInputCollapse}
                onOutputCollapse={this.onOutputCollapse}
                onParentCollapse={this.onParentCollapse}
                onItemAdd={this.onItemAdd}
                onItemRemove={this.onItemRemove}
                valueInputs={valueInputs}
                valueOutputs={valueOutputs}
                flowInputs={flowInputs}
                flowOutputs={flowOutputs}
                closable={false}
                centered
            />
        );
    }
}

export default MacroModalFormController;
