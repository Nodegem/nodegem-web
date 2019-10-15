import { Container } from 'unstated-typescript';

type ISandboxState = {
    isActive: boolean;
    initialTabs: (Graph | Macro)[];
};

export class SandboxContainer extends Container<ISandboxState> {
    public state = { isActive: false, initialTabs: [] };
}
