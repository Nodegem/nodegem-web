import { Button, Divider } from 'antd';
import React from 'react';

import { Flex, FlexRow } from 'components';
import './PromptGraph.less';

interface ITypeProps {
    onSelectGraph: () => void;
    onTypeSelect: (type: GraphType) => void;
}

const PromptGraph: React.FC<ITypeProps> = ({ onTypeSelect, onSelectGraph }) => {
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
            <FlexRow className="type-options" gap={15} wrap="wrap">
                <Button
                    onClick={() => onTypeSelect('graph')}
                    type="dashed"
                    size="large"
                    icon="plus"
                >
                    New Graph
                </Button>
                <Button
                    onClick={() => onTypeSelect('macro')}
                    type="dashed"
                    size="large"
                    icon="plus"
                >
                    New Macro
                </Button>
            </FlexRow>
        </>
    );
};

export default PromptGraph;
