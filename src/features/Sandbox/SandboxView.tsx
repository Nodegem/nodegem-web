import { Col, Row, Tabs, Tooltip } from 'antd';
import classNames from 'classnames';
import DraggableTabs from 'components/DraggableTabs/DraggableTabs';
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
                        <div className={selectInfo}>
                            <Tabs
                                style={{ width: '100%' }}
                                tabPosition="right"
                                onTabClick={() =>
                                    setSelectClosed(!selectClosed)
                                }
                            >
                                <TabPane tab="Stuff" key="1" closable={false}>
                                    <div
                                        className={classNames({
                                            container: true,
                                            closed: selectClosed,
                                        })}
                                    >
                                        Hello
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                        <div className="sandbox">Sandbox</div>
                        <div
                            className={infoClasses}
                            onClick={() => setInfoClosed(!infoClosed)}
                        >
                            <Tabs
                                style={{ width: '100%' }}
                                tabPosition="left"
                                onTabClick={() => setSelectClosed(!infoClosed)}
                            >
                                <TabPane
                                    tab="Other Stuff"
                                    key="1"
                                    closable={false}
                                >
                                    <div
                                        className={classNames({
                                            container: true,
                                            closed: selectClosed,
                                        })}
                                    >
                                        Node Info
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </TabPane>
            </DraggableTabs>
        </div>
    );
};
