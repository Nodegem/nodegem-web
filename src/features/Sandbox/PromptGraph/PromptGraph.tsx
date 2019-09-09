import { Button, Col, Divider, Icon, Row } from 'antd';
import React from 'react';

import './PromptGraph.less';

interface ITypeProps {
    onSelectGraph: () => void;
    onTypeSelect: (type: GraphType) => void;
}

const PromptGraph: React.FC<ITypeProps> = ({ onTypeSelect, onSelectGraph }) => {
    return (
        <>
            <Row className="type-options">
                <Col>
                    <Button
                        type="dashed"
                        size="large"
                        icon="select"
                        onClick={onSelectGraph}
                    >
                        Select Existing
                    </Button>
                </Col>
            </Row>
            <Divider dashed>OR</Divider>
            <Row className="type-options" gutter={50}>
                <Col>
                    <Button
                        onClick={() => onTypeSelect('graph')}
                        type="dashed"
                        size="large"
                        icon="plus"
                    >
                        New Graph
                    </Button>
                </Col>
                <Col>
                    <Button
                        onClick={() => onTypeSelect('macro')}
                        type="dashed"
                        size="large"
                        icon="plus"
                    >
                        New Macro
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default PromptGraph;
