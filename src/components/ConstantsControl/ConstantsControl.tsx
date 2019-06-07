import * as React from 'react';

interface ConstantsControlProps {}

interface ConstantsControlState {}

class ConstantsControl extends React.Component<
    ConstantsControlProps,
    ConstantsControlState
> {
    static getDerivedStateFromProps(nextProps) {
        if ('value' in nextProps) {
            return {
                ...(nextProps.value || {}),
            };
        }
        return null;
    }

    constructor(props) {
        super(props);
    }

    public render() {
        return <div />;
    }
}

export default ConstantsControl;
