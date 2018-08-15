import React, { PureComponent } from 'react';
import Input from '../../IO/Input/Input';

import "./InputList.scss";

export type InputListProps = {
    items: {name: string}[];
    onCompleteConnector: (e: React.MouseEvent, input: Input) => void;
}

export default class InputList extends React.PureComponent<InputListProps> {

    private handleMouseUp = (e: React.MouseEvent, input: Input) => {
        this.props.onCompleteConnector(e, input);
    }

    public render() {

        const {items} = this.props;
        const anyItems = items.length > 0;

        return (
            anyItems && 
            (
                <ul className="node-inputs" >
                    {items.map((item, index) => {
                        return <Input onMouseUp={this.handleMouseUp} key={index} name={item.name} />
                    })}
                </ul>
            )
        )
    }

}