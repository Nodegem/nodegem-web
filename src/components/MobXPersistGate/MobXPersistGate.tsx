import { observer } from 'mobx-react';
import * as React from 'react';

interface IPersistGateProps {
    rootStore: { isLoaded: boolean };
    loading?: JSX.Element;
}

@observer
export default class MobXPersistGate extends React.Component<
    IPersistGateProps
> {
    public render() {
        const { rootStore, loading, children } = this.props;

        return !rootStore.isLoaded ? loading : children;
    }
}
