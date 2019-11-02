// import { inject, observer } from 'mobx-react';
import { FlexColumn } from 'components';
import { Formik, FormikActions } from 'formik';
import { Form, FormItem, Input, Radio, SubmitButton } from 'formik-antd';
import * as React from 'react';
import * as Yup from 'yup';

// import { FlexColumn } from 'components/Flex';
// import { Formik, FormikActions } from 'formik';
// import { Form, FormItem } from 'formik-antd';
// import './GraphModalForm.less';

// // interface IFormDataProps {
// //     constants: Partial<ConstantData>[];
// //     data: Graph;
// //     recurringOptions: Partial<RecurringOptions>;
// //     onConstantDelete: (id: string) => void;
// //     onConstantAdd: () => void;
// // }

// // const GraphForm = Form.create<IFormDataProps & ModalProps & FormComponentProps>(
// //     {
// //         name: 'graph_form',
// //     }
// // )(
// //     class extends React.Component<
// //         IFormDataProps & ModalProps & FormComponentProps
// //     > {
// //         public render() {
// //             const {
// //                 form,
// //                 data,
// //                 onConstantAdd,
// //                 onConstantDelete,
// //                 constants,
// //                 recurringOptions,
// //                 ...rest
// //             } = this.props;
// //             const { getFieldDecorator } = form;

// //             const type = !form.getFieldValue('type')
// //                 ? data.type
// //                 : form.getFieldValue('type');
// //             const isRecurring = type === 'recurring';

// //             return (
// //                 <Modal {...rest}>
// //                     <Form layout="vertical">
// //                         <FormItem label="Name">
// //                             {getFieldDecorator<Graph>('name', {
// //                                 initialValue: data.name,
// //                                 rules: [
// //                                     {
// //                                         required: true,
// //                                         message: 'Name is required',
// //                                     },
// //                                 ],
// //                             })(<Input />)}
// //                         </FormItem>
// //                         <FormItem label="Description" required>
// //                             {getFieldDecorator<Graph>('description', {
// //                                 initialValue: data.description,
// //                                 rules: [
// //                                     {
// //                                         required: true,
// //                                         message: 'Description is required',
// //                                     },
// //                                 ],
// //                             })(
// //                                 <TextArea
// //                                     autosize={{ minRows: 3, maxRows: 8 }}
// //                                 />
// //                             )}
// //                         </FormItem>
// //                         <FormItem label="Execution Type" required>
// //                             {getFieldDecorator<Graph>('type', {
// //                                 initialValue: data.type,
// //                                 rules: [
// //                                     {
// //                                         required: true,
// //                                         message: 'Execution type is required',
// //                                     },
// //                                 ],
// //                             })(
// //                                 <Radio.Group>
// //                                     <Radio value="manual">Manual</Radio>
// //                                     <Radio value="recurring">Recurring</Radio>
// //                                     <Radio value="listener">Listener</Radio>
// //                                 </Radio.Group>
// //                             )}
// //                         </FormItem>
// //                         {isRecurring && (
// //                             <RecurringOptionsControl
// //                                 fd={getFieldDecorator}
// //                                 recurringOptions={recurringOptions}
// //                             />
// //                         )}
// //                         <ConstantsControl
// //                             fd={getFieldDecorator}
// //                             constants={constants}
// //                             onAddConstant={onConstantAdd}
// //                             onConstantDelete={onConstantDelete}
// //                         />
// //                     </Form>
// //                 </Modal>
// //             );
// //         }
// //     }
// // );

interface IFormValues {
    name: string;
    description?: string;
    type: ExecutionType;
    constants: IFormConstantData[];
}

interface IFormConstantData {
    label: string;
    type: ValueType;
    value: any;
    isSecret: boolean;
}

const validationSchema = Yup.object().shape<IFormValues>({
    name: Yup.string().required('Name is required'),
    description: Yup.string().notRequired(),
    type: Yup.mixed<ExecutionType>().oneOf(
        ['manual', 'listener', 'recurring'],
        'Must select an execution type'
    ),
    constants: Yup.array().of(
        Yup.object().shape<IFormConstantData>({
            label: Yup.string().required('Label is required'),
            type: Yup.mixed<ValueType>()
                .oneOf([
                    'any',
                    'text',
                    'textarea',
                    'boolean',
                    'number',
                    'time',
                    'date',
                    'datetime',
                    'phonenumber',
                    'url',
                ])
                .required('A value type is required'),
            isSecret: Yup.boolean(),
            value: Yup.mixed().required(),
        })
    ),
});

interface IGraphFormProps {
    handleSubmit: (
        values: IFormValues,
        actions: FormikActions<IFormValues>
    ) => void;
}

export const GraphForm: React.FC<IGraphFormProps> = ({ handleSubmit }) => {
    return (
        <Formik
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            initialValues={{
                name: '',
                description: '',
                type: 'manual',
                constants: [],
            }}
            render={({ isSubmitting }) => (
                <Form>
                    <FlexColumn className="graph-form" gap={15}>
                        <FormItem name="name" label="Name" required>
                            <Input name="name" placeholder="Name" />
                        </FormItem>
                        <FormItem name="description" label="Description">
                            <Input.TextArea
                                name="description"
                                placeholder="Description"
                            />
                        </FormItem>
                        <FormItem name="type" label="Execution Type">
                            <Radio.Group
                                name="type"
                                options={[
                                    { label: 'Manual', value: 'manual' },
                                    { label: 'Listener', value: 'listener' },
                                    { label: 'Recurring', value: 'recurring' },
                                ]}
                            />
                        </FormItem>
                        <SubmitButton type="primary" disabled={false}>
                            {isSubmitting ? 'Saving...' : 'Save'}
                        </SubmitButton>
                    </FlexColumn>
                </Form>
            )}
        />
    );
};

// interface IHeaderProps {
//     text: string;
//     active: boolean;
//     toggleActive: () => void;
// }

// const Header: React.FC<IHeaderProps> = ({ text, active, toggleActive }) => {
//     return (
//         <div className="graph-modal-header">
//             <span>{text}</span>
//             <Switch
//                 className="active-toggle"
//                 checked={active}
//                 checkedChildren="Active"
//                 unCheckedChildren="Inactive"
//                 onChange={toggleActive}
//             />
//         </div>
//     );
// };

// @inject('graphModalStore')
// @observer
// class GraphModalFormController extends React.Component<{
//     graphModalStore?: GraphModalStore;
//     onGoBack?: () => void;
//     onSave?: (graph: Graph | undefined, edit: boolean) => void;
// }> {
//     private formRef: Form;

//     public handleSubmit = async () => {
//         const { graphModalStore } = this.props;
//         const { form } = this.formRef.props;

//         form!.validateFields(async (err, values) => {
//             if (err) {
//                 return;
//             }
//             const graph = await graphModalStore!.saveGraph({
//                 ...values,
//             });

//             if (this.props.onSave) {
//                 this.props.onSave(graph, graphModalStore!.editMode);
//             }

//             form!.resetFields();
//             graphModalStore!.closeModal();
//         });
//     };

//     public handleCancel = () => {
//         const { form } = this.formRef.props;

//         form!.resetFields();

//         if (this.props.onGoBack) {
//             this.props.onGoBack();
//         }

//         this.props.graphModalStore!.closeModal();
//     };

//     public onConstantAdd = () => {
//         this.props.graphModalStore!.addConstant();
//         this.forceUpdate();
//     };

//     public onConstantDelete = (id: string) => {
//         this.props.graphModalStore!.removeConstant(id);
//     };

//     public saveFormRef = formRef => {
//         this.formRef = formRef;
//     };

//     public render() {
//         const { graphModalStore, onGoBack } = this.props;
//         const {
//             isActive,
//             saving,
//             editMode,
//             modalData,
//             isVisible,
//             constants,
//             recurringOptions,
//             toggleActive,
//         } = graphModalStore!;

//         const modalTitle = editMode ? 'Edit Graph Settings' : 'Add Graph';

//         let okButton = '';
//         // tslint:disable-next-line: prefer-conditional-expression
//         if (saving) {
//             okButton = editMode ? 'Saving' : 'Adding';
//         } else {
//             okButton = editMode ? 'Save' : 'Add';
//         }

//         return (
//             <GraphForm
//                 className="macro-modal-form"
//                 wrappedComponentRef={this.saveFormRef}
//                 title={
//                     <Header
//                         active={isActive}
//                         toggleActive={toggleActive}
//                         text={modalTitle}
//                     />
//                 }
//                 visible={isVisible}
//                 okText={okButton}
//                 onOk={this.handleSubmit}
//                 onCancel={this.handleCancel}
//                 width={1000}
//                 okButtonProps={{ loading: saving }}
//                 data={modalData}
//                 constants={constants}
//                 recurringOptions={recurringOptions}
//                 onConstantAdd={this.onConstantAdd}
//                 onConstantDelete={this.onConstantDelete}
//                 closable={false}
//                 centered
//             />
//         );
//     }
// }

// export default GraphModalFormController;

export default {};
