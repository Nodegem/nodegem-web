import { userStore } from './user-store';
import { appStore } from './app-store';
import { ignore } from 'mobx-sync';
import { observable } from 'mobx';

export class RootStore {

    @ignore
    @observable
    isLoaded: boolean = false;
    
    editor: any = { nodes: [], links: [] };
    app = appStore;
    user = userStore;

    public setEditorState = (state: any) => {
        this.editor = state;
    }
}

export const rootStore = new RootStore();