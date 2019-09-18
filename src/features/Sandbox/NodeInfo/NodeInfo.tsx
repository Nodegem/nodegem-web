import React, { useEffect, useState } from 'react';

import { Button, Divider, Empty, Form, Icon, Input } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import Title from 'antd/lib/typography/Title';
import classNames from 'classnames';
import NodeController from '../Node/node-controller';
import './NodeInfo.less';

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

const PropertyGroup: React.FC<IPropertyGroupProps> = ({ title, portList }) => {
    console.log(portList);
    return (
        <div className="property-group">
            <p>{title}:</p>
            {portList.map(p => (
                <Form.Item key={p.id} label={p.name}>
                    <Input
                        placeholder={p.name}
                        disabled={p.connected}
                        value={p.data && p.data.value}
                    />
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

    const handleSubmit = () => {};

    const valueInputs = form.filter(
        x => x.io === 'input' && x.type === 'value'
    );

    return (
        <Form onSubmit={handleSubmit} className="node-info-form">
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
                    <Button type="primary" htmlType="submit" block>
                        Update
                    </Button>
                </Form.Item>
            </div>
        </Form>
    );
};

export default NodeInfo;
