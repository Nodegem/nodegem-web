import React from 'react';

import './Node.less';

export const Node: React.FC = props => {
    return <div className="node-container">{props.children}</div>;
};
