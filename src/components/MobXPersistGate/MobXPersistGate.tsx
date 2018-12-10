import * as React from "react";
import { observer } from "mobx-react";

interface PersistGateProps {
    persistStore: { isLoaded: boolean };
    loading?: JSX.Element;
}

@observer
export default class MobXPersistGate extends React.Component<PersistGateProps> {

    public render() {

        const { persistStore, loading, children } = this.props;

        return (
            !persistStore.isLoaded
                ? loading
                : children
        );
    }

}