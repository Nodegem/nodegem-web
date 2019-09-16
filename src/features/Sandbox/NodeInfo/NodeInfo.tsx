import React from 'react';

import { Divider, Empty, Form, Icon, Input } from 'antd';
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {};

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
                        <Title level={3}>{selectedNode.nodeData.title}</Title>
                        <Divider />
                    </div>
                    <div className="node-info-description">
                        <Title level={4}>Description:</Title>
                        <Paragraph>
                            {selectedNode.nodeData.description || 'N/A'}
                        </Paragraph>
                        <Divider />
                    </div>
                    <div className="node-info-properties">
                        <Title level={4}>Properties:</Title>
                        <NodeInfoForm nodeInfo={selectedNode} />
                    </div>
                </>
            )}
        </div>
    );
};

interface INodeInfoForm {
    nodeInfo: NodeController;
}

class NodeInfoForm extends React.Component<INodeInfoForm> {
    public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    public render() {
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item label="sdas">
                    <Input
                        prefix={
                            <Icon
                                type="user"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                            />
                        }
                        placeholder="Username"
                    />
                </Form.Item>
            </Form>
        );
    }
}

export default NodeInfo;
