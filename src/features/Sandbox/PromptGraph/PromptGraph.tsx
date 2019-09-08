import { Button } from 'antd';
import React from 'react';

import './PromptGraph.less';

interface ITypeProps {
    onTypeSelect: (type: GraphType) => void;
}

const PromptGraph: React.FC<ITypeProps> = ({ onTypeSelect }) => {
    return (
        <>
            <div className="type-options">
                <Button
                    onClick={() => onTypeSelect('graph')}
                    type="dashed"
                    size="large"
                >
                    New Graph
                </Button>
                <Button
                    onClick={() => onTypeSelect('macro')}
                    type="dashed"
                    size="large"
                >
                    New Macro
                </Button>
            </div>
        </>
    );
};

export default PromptGraph;
