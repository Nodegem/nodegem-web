import * as React from 'react';
import ConstantField from './ConstantField';
import Form, { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { Button, Icon, Divider } from 'antd';

interface ConstantsControlProps {
    onAddConstant: () => void;
    onConstantDelete: (id: string) => void;
    constants: Partial<ConstantData>[];
    fd: <T extends Object = {}>(
        id: keyof T,
        options?: GetFieldDecoratorOptions | undefined
    ) => (node: React.ReactNode) => React.ReactNode;
}

class ConstantsControl extends React.Component<ConstantsControlProps> {
    constructor(props) {
        super(props);
    }

    private validate = (rule, value, callback) => {
        if (value.label && value.value) {
            callback();
            return;
        }

        if (!value.label && value.value) {
            callback('Must provide a name to the constant');
            return;
        }

        if (!value.value && value.label) {
            callback('Must provide a value to the constant');
            return;
        }
    };

    public render() {
        const { constants, fd, onAddConstant, onConstantDelete } = this.props;

        return (
            <>
                <Divider>Constants</Divider>
                {(constants || []).map(c => (
                    <Form.Item key={c.key}>
                        {fd(`constants[${c.key}]`, {
                            initialValue: c,
                            rules: [{ validator: this.validate }],
                        })(
                            <ConstantField
                                constantKey={c.key!}
                                onDelete={onConstantDelete}
                            />
                        )}
                    </Form.Item>
                ))}
                <Button block type="dashed" onClick={onAddConstant}>
                    <Icon type="plus" /> Add Constant
                </Button>
            </>
        );
    }
}

export default ConstantsControl;
