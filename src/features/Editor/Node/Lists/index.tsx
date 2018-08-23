import React from 'react';
import Output from '../IO/Output/Output';
import Input from '../IO/Input/Input';
import { IOData, ConnectorData } from '../../NodeCanvas/types';

import './styles.scss';

type FieldListType = React.ComponentType<{ items: IOData[], type: "inputs" | "outputs", children: React.ComponentType<{ item: IOData }> }>
const FieldList: FieldListType = ({ items, type, children }) => <ul className={`node-fields node-${type}`}>{items.map((item, key) => React.createElement(children, { item, key }))}</ul>

type OutputListProps = {
    items: IOData[];
    connectedFields: { [fieldId: string]: number };
    onStartConnector: (e: React.MouseEvent, output: Output) => void;
}
export class OutputList extends React.PureComponent<OutputListProps> {

    private _outputs: Output[];
    public get outputs(): Output[] {
        return this._outputs;
    }

    public render() {
        const { items, onStartConnector, connectedFields } = this.props;
        this._outputs = [];
        return (
            <FieldList type="outputs" items={items}>{
                ({ item }) => <Output ref={(o) => this._outputs.push(o!)} {...item} connected={connectedFields[item.id] > 0}
                    onMouseDown={onStartConnector} />}
            </FieldList>
        )
    }
}

type InputListProps = {
    items: IOData[];
    connectedFields: { [fieldId: string]: number };
    onCompleteConnector: (e: React.MouseEvent, input: Input) => void;
}
export class InputList extends React.PureComponent<InputListProps> {

    private _inputs: Input[];
    public get inputs(): Input[] {
        return this._inputs;
    }

    public render() {
        this._inputs = [];
        const { items, onCompleteConnector, connectedFields } = this.props;
        return (
            <FieldList type="inputs" items={items}>{
                ({ item }) => <Input ref={(i) => this.inputs.push(i!)} {...item} connected={connectedFields[item.id] > 0}
                    onMouseUp={onCompleteConnector} />}
            </FieldList>
        )
    }
}