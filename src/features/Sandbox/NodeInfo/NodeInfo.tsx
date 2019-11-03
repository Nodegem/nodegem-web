import React, { useEffect, useState } from 'react';

import { Button, Divider, Form } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';
import { ValueTypeControl } from 'components/ValueTypeControl/ValueTypeControl';
import _ from 'lodash';
import './NodeInfo.less';

interface INodeInfoProps {
    selectedNode: INodeUIData;
    onNodeValueChange: (node: INodeUIData, fields: IPortUIData[]) => void;
}

const NodeInfo: React.FC<INodeInfoProps> = ({
    selectedNode,
    onNodeValueChange,
}) => {
    const containerClass = classNames({
        'node-info': true,
    });

    const handleUpdate = (fields: IPortUIData[]) => {
        onNodeValueChange(selectedNode!, fields);
    };

    return (
        <div className={containerClass}>
            <div className="node-info-title">
                <p className="header">{selectedNode.title}</p>
            </div>
            <Divider />
            <div className="node-info-description">
                <p className="header underline">Description:</p>
                <Paragraph>{selectedNode.description || 'N/A'}</Paragraph>
            </div>
            {selectedNode.valueInputs && selectedNode.valueInputs.any() && (
                <>
                    <Divider />
                    <div className="node-info-properties">
                        <NodeInfoForm
                            valueInputs={selectedNode.valueInputs}
                            onUpdate={handleUpdate}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

interface IPropertyGroupProps {
    portList: IPortUIData[];
    onFieldChange: (port: IPortUIData) => void;
}

const PropertyGroup: React.FC<IPropertyGroupProps> = ({
    portList,
    onFieldChange,
}) => {
    const handleChange = (port: IPortUIData, value: any) => {
        port.value = value;
        onFieldChange(port);
    };

    return (
        <>
            {portList.map(p => (
                <Form.Item key={p.id} label={p.name}>
                    <ValueTypeControl
                        valueType={p.valueType}
                        name={p.name}
                        disabled={p.connected}
                        value={p.value}
                        onChange={value => handleChange(p, value)}
                    />
                </Form.Item>
            ))}
        </>
    );
};

interface INodeInfoForm {
    valueInputs: IPortUIData[];
    onUpdate: (newValues: IPortUIData[]) => void;
}

const NodeInfoForm: React.FC<INodeInfoForm> = ({ valueInputs, onUpdate }) => {
    const [form, setForm] = useState(valueInputs.map(x => _.cloneDeep(x)));
    const [isDirty, setIsDirty] = useState(false);

    const handleSubmit = () => {
        if (isDirty) {
            const copiedValues = _.cloneDeep(form);
            valueInputs = copiedValues;
            onUpdate(copiedValues);
            setIsDirty(false);
        }
    };

    const handleReset = () => {
        setForm(valueInputs.map(x => _.cloneDeep(x)));
        setIsDirty(false);
    };

    const handleValueChange = (port: IPortUIData) => {
        const p = form.firstOrDefault(x => x.id === port.id);
        if (p) {
            const newForm = form.map(x => ({ ...x, value: x.value }));
            setIsDirty(!_.isEqual(newForm, valueInputs));
            setForm(newForm);
        }
    };

    useEffect(() => {
        setForm(valueInputs.map(x => _.cloneDeep(x)));
    }, [valueInputs]);

    return (
        <Form className="node-info-form">
            <p>Editable Fields:</p>
            <div className="properties">
                {form.length > 0 && (
                    <PropertyGroup
                        portList={form}
                        onFieldChange={handleValueChange}
                    />
                )}
            </div>
            <div className="info-submit">
                <Form.Item style={{ margin: '0' }}>
                    <Button
                        disabled={!isDirty}
                        type="primary"
                        onClick={handleSubmit}
                        block
                    >
                        Update
                    </Button>
                    <Button
                        disabled={!isDirty}
                        type="danger"
                        onClick={handleReset}
                        block
                    >
                        Reset
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default NodeInfo;
