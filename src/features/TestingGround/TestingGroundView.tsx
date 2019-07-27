import { VerticalCollapsible } from 'components/VerticalCollapsible';
import React, { useState } from 'react';

export const TestingGroundView: React.FC = () => {
    const [close, setClosed] = useState(false);

    return (
        <VerticalCollapsible
            tabDirection="left"
            onTabClick={() => setClosed(!close)}
            collapsed={close}
            tabContent={<div>Hello</div>}
        >
            sdsa
        </VerticalCollapsible>
    );
};
