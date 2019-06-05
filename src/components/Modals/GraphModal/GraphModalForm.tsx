import { Form, Input, Divider, Modal } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
import { inject, observer } from 'mobx-react';
import * as React from 'react';

import { GraphModalStore } from './graph-modal-store';
import EnvironmentVariables from 'src/components/EnvironmentVariables/EnvironmentVariables';
import { ModalProps } from 'antd/lib/modal';
import { FormComponentProps } from 'antd/lib/form';

interface FormDataProps {
    data: Graph;
}

const GraphForm = Form.create<FormDataProps & ModalProps & FormComponentProps>({
    name: 'graph_form',
})(
    class extends React.Component<
        FormDataProps & ModalProps & FormComponentProps
    > {
        render() {
            const { form, data, ...rest } = this.props;
            const { getFieldDecorator } = form;
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
                        {/* <Divider>Graph Constants</Divider>
                        <EnvironmentVariables /> */}
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

    handleSubmit = async () => {
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

    handleCancel = () => {
        const { form } = this.formRef.props;

        form!.resetFields();
        this.props.graphModalStore!.closeModal();
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    public render() {
        const { graphModalStore } = this.props;
        const { saving, editMode, data, isVisible } = graphModalStore!;

        const modalTitle = editMode ? 'Edit Graph' : 'Add Graph';

        let okButton = '';
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
                width={700}
                okButtonProps={{ loading: saving }}
                data={data}
            />
        );
    }
}

export default GraphModalFormController;
