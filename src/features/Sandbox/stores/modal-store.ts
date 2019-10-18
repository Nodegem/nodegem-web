import { Store } from 'overstated';
import { SandboxStore } from './sandbox-store';
interface IModalState {
    isInSelectionState: boolean;
    isChoosingGraphState: boolean;
}

export class ModalStore extends Store<IModalState, SandboxStore> {
    public state: IModalState = {
        isInSelectionState: true,
        isChoosingGraphState: false,
    };

    public toggleSelectionState = (value?: boolean) => {
        this.setState({
            isInSelectionState: this.state.isInSelectionState.toggle(value),
        });
    };

    public toggleChoosingGraphState = (value?: boolean) => {
        this.setState({
            isChoosingGraphState: this.state.isChoosingGraphState.toggle(value),
        });
    };
}
