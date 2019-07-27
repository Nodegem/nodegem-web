import { Col, Row, Tabs, Tooltip } from 'antd';
import classNames from 'classnames';
import DraggableTabs from 'components/DraggableTabs/DraggableTabs';
import { VerticalCollapsible } from 'components/VerticalCollapsible/VerticalCollapsible';
import React, { useRef, useState } from 'react';
import './Sandbox.less';

const { TabPane } = Tabs;

export const SandboxView: React.FC = () => {
    const [selectClosed, setSelectClosed] = useState(false);
    const [infoClosed, setInfoClosed] = useState(false);

    const selectInfo = classNames({
        'node-select': true,
        container: true,
        closed: selectClosed,
    });

    const infoClasses = classNames({
        'node-info': true,
        container: true,
        closed: infoClosed,
    });

    return (
        <div className="sandbox-container">
            <DraggableTabs size="large">
                <TabPane tab="sdas" key="1" closable={false}>
                    <div className="tab-container">
                        <VerticalCollapsible
                            collapsed={false}
                            tabContent={<div>Test Again</div>}
                        >
                            <div>test</div>
                        </VerticalCollapsible>
                        <div className="sandbox">Sandbox</div>
                        <div
                            className={infoClasses}
                            onClick={() => setInfoClosed(!infoClosed)}
                        >
                            Test
                        </div>
                    </div>
                </TabPane>
            </DraggableTabs>
        </div>
    );
};
