import * as React from 'react';

type GenericControlProps = { control: any; bindControl: Function };
export default class GenericControlView extends React.Component<
    GenericControlProps
> {
    private controlContainer: HTMLDivElement;

    public componentDidMount() {
        this.props.bindControl(this.controlContainer, this.props.control);
    }

    public render() {
        return (
            <div
                className="control-container"
                ref={e => (this.controlContainer = e!)}
            />
        );
    }
}
