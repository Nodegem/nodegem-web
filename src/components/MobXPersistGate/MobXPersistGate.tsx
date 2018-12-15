import { observer } from 'mobx-react';
import * as React from 'react';

interface PersistGateProps {
    rootStore: { isLoaded: boolean };
    loading?: JSX.Element;
}

@observer
export default class MobXPersistGate extends React.Component<PersistGateProps> {

    public render() {

        const { rootStore, loading, children } = this.props;

        return (
            !rootStore.isLoaded
                ? loading
                : children
        );
    }

}