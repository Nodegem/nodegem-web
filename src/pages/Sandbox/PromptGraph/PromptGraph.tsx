import { Button, Divider, List } from 'antd';
import React from 'react';

import { FlexRow } from 'components';
import './PromptGraph.less';

interface ITypeProps {
    onSelectGraph: () => void;
    onTypeSelect: (type: GraphType) => void;
}

const PromptGraph: React.FC<ITypeProps> = ({ onTypeSelect, onSelectGraph }) => {
    const buttons = [
        <Button
            onClick={() => onTypeSelect('graph')}
            type="dashed"
            size="large"
            icon="plus"
        >
            New Graph
        </Button>,
        <Button
            onClick={() => onTypeSelect('macro')}
            type="dashed"
            size="large"
            icon="plus"
        >
            New Macro
        </Button>,
    ];

    return (
        <>
            <FlexRow className="type-options">
                <Button
                    type="dashed"
                    size="large"
                    icon="select"
                    onClick={onSelectGraph}
                >
                    Select Existing
                </Button>
            </FlexRow>
            <Divider dashed>OR</Divider>
            <List
                className="type-options"
                grid={{ gutter: 16, sm: 1, md: 2 }}
                dataSource={buttons}
                renderItem={item => <List.Item>{item}</List.Item>}
            />
        </>
    );
};

export default PromptGraph;
