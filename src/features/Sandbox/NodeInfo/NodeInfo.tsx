import React, { useEffect, useState } from 'react';

import {
    Button,
    DatePicker,
    Divider,
    Empty,
    Form,
    Input,
    InputNumber,
    Select,
    Switch,
    TimePicker,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';
import { PhoneInput } from 'components/PhoneInput/PhoneInput';
import _ from 'lodash';
import { toJS } from 'mobx';
import moment from 'moment';
import NodeController from '../Node/node-controller';
import './NodeInfo.less';

const { Option } = Select;

interface INodeInfoProps {
    selectedNode: NodeController;
    onNodeValueChange: (node: NodeController, fields: IPortUIData[]) => void;
}

const NodeInfo: React.FC<INodeInfoProps> = ({
    selectedNode,
    onNodeValueChange,
}) => {
    const containerClass = classNames({
        'node-info': true,
        empty: !selectedNode,
    });

    const handleUpdate = (fields: IPortUIData[]) => {
        onNodeValueChange(selectedNode!, fields);
    };

    return (
        <div className={containerClass}>
            <div className="node-info-title">
                <p className="header">{selectedNode.nodeData.title}</p>
            </div>
            <Divider />
            <div className="node-info-description">
                <p className="header underline">Description:</p>
                <Paragraph>
                    {selectedNode.nodeData.description || 'N/A'}
                </Paragraph>
            </div>
            <Divider />
            <div className="node-info-properties">
                <NodeInfoForm
                    valueInputs={selectedNode.portsList.filter(
                        x => x.io === 'input' && x.type === 'value'
                    )}
                    onUpdate={handleUpdate}
                />
            </div>
        </div>
    );
};

interface IPropertyGroupProps {
    portList: IPortUIData[];
    onFieldChange: (port: IPortUIData) => void;
}

const selectBefore = (value: string, isDisabled: boolean | undefined) => (
    <Select
        disabled={isDisabled}
        value={
            value && value.toLowerCase().includes('http://')
                ? 'Http://'
                : 'Https://'
        }
        style={{ width: 90 }}
    >
        <Option value="Http://">Http://</Option>
        <Option value="Https://">Https://</Option>
    </Select>
);

const PropertyGroup: React.FC<IPropertyGroupProps> = ({
    portList,
    onFieldChange,
}) => {
    const renderInput = (port: IPortUIData) => {
        const { value, defaultValue, connected, name } = port;

        const handleChange = v => {
            port.value = v;
            onFieldChange(port);
        };

        switch (port.valueType) {
            case 'boolean':
                return (
                    <Switch
                        checked={value || defaultValue}
                        disabled={connected}
                        onChange={handleChange}
                    />
                );
            case 'number':
                return (
                    <InputNumber
                        value={value || defaultValue}
                        disabled={connected}
                        onChange={handleChange}
                    />
                );
            case 'url':
                return (
                    <Input
                        addonBefore={selectBefore(
                            value && value.toString(),
                            connected
                        )}
                        value={value || defaultValue}
                        disabled={connected}
                        onChange={event => handleChange(event.target.value)}
                    />
                );
            case 'phonenumber':
                return (
                    <PhoneInput
                        value={value || defaultValue}
                        disabled={connected}
                        onChange={handleChange}
                    />
                );
            case 'date':
                return (
                    <DatePicker
                        value={moment(value) || moment(defaultValue)}
                        disabled={connected}
                        onChange={handleChange}
                    />
                );

            case 'datetime':
                return (
                    <DatePicker
                        value={moment(value) || moment(defaultValue)}
                        disabled={connected}
                        allowClear
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        onChange={handleChange}
                    />
                );
            case 'time':
                return (
                    <TimePicker
                        value={moment(value) || moment(defaultValue)}
                        disabled={connected}
                        allowClear
                        use12Hours={navigator.language.startsWith('en-US')}
                        onChange={handleChange}
                    />
                );
            case 'textarea':
                return (
                    <TextArea
                        value={value || defaultValue}
                        disabled={connected}
                        autosize={{ minRows: 2 }}
                        onChange={event => handleChange(event.target.value)}
                    />
                );
            default:
                return (
                    <Input
                        placeholder={name}
                        disabled={connected}
                        value={value || defaultValue}
                        onChange={event => handleChange(event.target.value)}
                    />
                );
        }
    };

    return (
        <>
            {portList.map(p => (
                <Form.Item key={p.id} label={p.name}>
                    {renderInput(p)}
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
            const newForm = form.map(x => ({ ...x, value: toJS(x.value) }));
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
