import * as React from 'react';
import { DrawingConnection } from './types';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';

import "./FlowEditor.scss";
import { HotKeys } from 'react-hotkeys';
import Canvas from './Canvas/Canvas';
import { canvasPattern } from './Patterns';



const EDITOR_KEY_MAP = {

}

@observer
class FlowEditor extends React.Component {

    public render() {

        const hotkeyHandler = {

        }

        return (
            <div className="flow-editor">
                <HotKeys keyMap={EDITOR_KEY_MAP} handlers={hotkeyHandler} >
                    <Canvas size={[15000, 15000]} pattern={canvasPattern(200)} fillId="#grid">
                        <g id="_connections">

                        </g>
                        <g id="_nodes">

                        </g>
                    </Canvas>
                </HotKeys>
            </div>
        )
    }

}

export default FlowEditor;