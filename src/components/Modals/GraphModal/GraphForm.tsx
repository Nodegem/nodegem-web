import {
    AntDatePicker,
    AntInput,
    AntSelect,
    AntTimePicker,
} from 'components/Formik/Fields/CreateAntField';
import { Field, Form, Formik, FormikProps, withFormik } from 'formik';
import moment from 'moment';
import React from 'react';

const InnerGraphForm = (props: FormikProps<Graph>) => {
    const { isSubmitting, values, submitCount } = props;
    console.log(moment(values.createdOn));
    return (
        <Form>
            <Field
                placeholder="Name"
                component={AntInput}
                name="name"
                label="Name"
                submitCount={submitCount}
                hasFeedback
            />
            <Field
                component={AntDatePicker}
                name="createdOn"
                label="Booking Date"
                defaultValue={moment()}
                submitCount={submitCount}
                format="MM-DD-YYYY"
                hasFeedback
            />
            <Field
                component={AntTimePicker}
                name="createdOn"
                label="Booking Time"
                defaultValue={moment()}
                hourStep={1}
                minuteStep={5}
                submitCount={submitCount}
                hasFeedback
                use12Hours
            />
            <button className="ant-btn ant-btn-primary" disabled={isSubmitting}>
                Submit
            </button>
        </Form>
    );
};

interface IGraphFormProps {
    graph: Graph;
}

export const GraphForm = withFormik<IGraphFormProps, Graph>({
    mapPropsToValues: props => {
        return { ...props.graph, createdOn: moment(props.graph.createdOn) };
    },
    validate: (values: Graph) => {},
    handleSubmit: values => {},
})(InnerGraphForm);
