import * as React from 'react';
import { Collapse } from 'antd';
import EnvironmentVariableField from './EnvironmentVariableField';

const Panel = Collapse.Panel;

class EnvironmentVariables extends React.Component {
    public render() {
        return (
            <Collapse>
                <Panel header="Test" key="1">
                    <EnvironmentVariableField />
                </Panel>
                <Panel header="Test" key="2" />
            </Collapse>
        );
    }
}

export default EnvironmentVariables;
