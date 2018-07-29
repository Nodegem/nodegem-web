import { PureComponent } from "react";

export interface PersistGateProps {
    loading: JSX.Element | null;
    persistor: () => Promise<void>;
}

export interface PersistGateState {
    isLoading: boolean;
}

export default class ResubPersistGate extends PureComponent<PersistGateProps, PersistGateState> {

    state = {
        isLoading: true
    }

    componentDidMount() {

        const { persistor } = this.props;

        persistor().then(() => {
            this.setState({isLoading: false})
        });

    }

    public render() {

        const { loading, children } = this.props;
        const { isLoading } = this.state;

        return (
            isLoading
            ? loading
            : children
        )

    }

}