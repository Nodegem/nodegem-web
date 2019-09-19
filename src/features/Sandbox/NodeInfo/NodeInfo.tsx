import React, { useEffect, useState } from 'react';

import { Button, Empty, Form, Input, InputNumber, Select, Switch } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import classNames from 'classnames';
import NodeController from '../Node/node-controller';
import './NodeInfo.less';

const { Option } = Select;

interface INodeInfoProps {
    selectedNode?: NodeController;
}

const NodeInfo: React.FC<INodeInfoProps> = ({ selectedNode }) => {
    const containerClass = classNames({
        'node-info': true,
        empty: !selectedNode,
    });

    const handleUpdate = (value: IPortUIData) => {};

    return (
        <div className={containerClass}>
            {!selectedNode ? (
                <Empty
                    description="Select a Node"
                    style={{ alignItems: 'center' }}
                />
            ) : (
                <>
                    <div className="node-info-title">
                        <p className="header">{selectedNode.nodeData.title}</p>
                    </div>
                    <div className="node-info-description">
                        <p className="header underline">Description:</p>
                        <Paragraph>
                            {selectedNode.nodeData.description || 'N/A'}
                        </Paragraph>
                    </div>
                    <div className="node-info-properties">
                        <NodeInfoForm nodeInfo={selectedNode} />
                    </div>
                </>
            )}
        </div>
    );
};

interface IPropertyGroupProps {
    title: string;
    portList: IPortUIData[];
}

const selectBefore = (value: string) => (
    <Select
        defaultValue={
            value.toLowerCase().includes('https') ? 'Https://' : 'Http://'
        }
        style={{ width: 90 }}
    >
        <Option value="Http://">Http://</Option>
        <Option value="Https://">Https://</Option>
    </Select>
);

const PropertyGroup: React.FC<IPropertyGroupProps> = ({ title, portList }) => {
    const renderInput = (port: IPortUIData) => {
        const { data, defaultValue, connected, name } = port;
        const value = data && data.value;
        switch (port.valueType) {
            case 'Boolean':
                return (
                    <Switch
                        defaultChecked={defaultValue}
                        checked={value}
                        disabled={connected}
                    />
                );
            case 'Number':
                return (
                    <InputNumber
                        defaultValue={defaultValue}
                        value={value}
                        disabled={connected}
                    />
                );
            case 'Url':
                return (
                    <Input
                        addonBefore={selectBefore(value)}
                        defaultValue={defaultValue}
                        value={value}
                        disabled={connected}
                    />
                );
            default:
                return (
                    <Input
                        placeholder={name}
                        disabled={connected}
                        value={value}
                    />
                );
        }
    };

    return (
        <div className="property-group">
            <p>{title}:</p>
            {portList.map(p => (
                <Form.Item key={p.id} label={p.name}>
                    {renderInput(p)}
                </Form.Item>
            ))}
        </div>
    );
};

interface INodeInfoForm {
    nodeInfo: NodeController;
}

const NodeInfoForm: React.FC<INodeInfoForm> = ({ nodeInfo }) => {
    const [form, setForm] = useState(nodeInfo.portsList.map(x => ({ ...x })));

    const handleSubmit = () => {
        console.log(form);
    };

    useEffect(() => {
        setForm(nodeInfo.portsList.map(x => ({ ...x })));
    }, [nodeInfo]);

    const valueInputs = form.filter(
        x => x.io === 'input' && x.type === 'value'
    );

    return (
        <Form className="node-info-form">
            <div style={{ height: '100%' }}>
                {valueInputs.length > 0 && (
                    <PropertyGroup
                        portList={valueInputs}
                        title="Editable Fields"
                    />
                )}
            </div>
            <div className="info-submit">
                <Form.Item style={{ margin: '0' }}>
                    <Button type="primary" onClick={handleSubmit} block>
                        Update
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default NodeInfo;
