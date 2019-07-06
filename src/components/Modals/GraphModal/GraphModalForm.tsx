import { Form, Input, Modal, Radio } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

import { FormComponentProps } from 'antd/lib/form';
import { ModalProps } from 'antd/lib/modal';
import ConstantsControl from 'src/components/ConstantsControl/ConstantsControl';
import RecurringOptionsControl from 'src/components/RecurringOptionsControl/RecurringOptionsControl';
import { GraphModalStore } from './graph-modal-store';

interface IFormDataProps {
    constants: Partial<ConstantData>[];
    data: Graph;
    recurringOptions?: RecurringOptions;
    onConstantDelete: (id: string) => void;
    onConstantAdd: () => void;
}

const GraphForm = Form.create<IFormDataProps & ModalProps & FormComponentProps>(
    {
        name: 'graph_form',
    }
)(
    class extends React.Component<
        IFormDataProps & ModalProps & FormComponentProps
    > {
        public render() {
            const {
                form,
                data,
                onConstantAdd,
                onConstantDelete,
                constants,
                ...rest
            } = this.props;
            const { getFieldDecorator } = form;

            const type = !form.getFieldValue('type')
                ? data.type
                : form.getFieldValue('type');
            const isRecurring = type === 'recurring';

            return (
                <Modal {...rest}>
                    <Form layout="vertical">
                        <FormItem label="Name">
                            {getFieldDecorator<Graph>('name', {
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
                            {getFieldDecorator<Graph>('description', {
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
                        <FormItem label="Execution Type" required>
                            {getFieldDecorator<Graph>('type', {
                                initialValue: data.type,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Execution type is required',
                                    },
                                ],
                            })(
                                <Radio.Group>
                                    <Radio value="manual">Manual</Radio>
                                    <Radio value="recurring">Recurring</Radio>
                                    <Radio value="listener">Listener</Radio>
                                </Radio.Group>
                            )}
                        </FormItem>
                        {isRecurring && (
                            <RecurringOptionsControl fd={getFieldDecorator} />
                        )}
                        <ConstantsControl
                            fd={getFieldDecorator}
                            constants={constants}
                            onAddConstant={onConstantAdd}
                            onConstantDelete={onConstantDelete}
                        />
                    </Form>
                </Modal>
            );
        }
    }
);

@inject('graphModalStore')
@observer
class GraphModalFormController extends React.Component<{
    graphModalStore?: GraphModalStore;
}> {
    private formRef: Form;

    public handleSubmit = async () => {
        const { graphModalStore } = this.props;
        const { form } = this.formRef.props;

        form!.validateFields(async (err, values) => {
            if (err) {
                return;
            }

            await graphModalStore!.saveGraph(values);

            form!.resetFields();
            graphModalStore!.closeModal();
        });
    };

    public handleCancel = () => {
        const { form } = this.formRef.props;

        form!.resetFields();
        this.props.graphModalStore!.closeModal();
    };

    public onConstantAdd = () => {
        this.props.graphModalStore!.addConstant();
        this.forceUpdate();
    };

    public onConstantDelete = (id: string) => {
        this.props.graphModalStore!.removeConstant(id);
    };

    public saveFormRef = formRef => {
        this.formRef = formRef;
    };

    public render() {
        const { graphModalStore } = this.props;
        const {
            saving,
            editMode,
            modalData,
            isVisible,
            constants,
            recurringOptions,
        } = graphModalStore!;

        const modalTitle = editMode ? 'Edit Graph Settings' : 'Add Graph';

        let okButton = '';
        // tslint:disable-next-line: prefer-conditional-expression
        if (saving) {
            okButton = editMode ? 'Saving' : 'Adding';
        } else {
            okButton = editMode ? 'Save' : 'Add';
        }

        return (
            <GraphForm
                wrappedComponentRef={this.saveFormRef}
                title={modalTitle}
                visible={isVisible}
                okText={okButton}
                onOk={this.handleSubmit}
                onCancel={this.handleCancel}
                width={1000}
                okButtonProps={{ loading: saving }}
                data={modalData}
                constants={constants}
                recurringOptions={recurringOptions}
                onConstantAdd={this.onConstantAdd}
                onConstantDelete={this.onConstantDelete}
            />
        );
    }
}

export default GraphModalFormController;
