import React, { PureComponent } from 'react';
import Output from '../../IO/Output/Output';

import "./OutputList.scss";

export type OutputListProps = {
    items: {name: string}[];
    onStartConnector: (e: React.MouseEvent, output: Output) => void;
}

export default class OutputList extends React.PureComponent<OutputListProps> {

    private handleMouseDown = (e: React.MouseEvent, output: Output) => {
        this.props.onStartConnector(e, output);
    }

    public render() {

        const {items} = this.props;
        const anyItems = items.length > 0;

        return (
            anyItems && 
            (
                <ul className="node-outputs">
                    {items.map((item, index) => {
                        return <Output onMouseDown={this.handleMouseDown} key={index} name={item.name} />
                    })}
                </ul>
            )
        )
    }

}