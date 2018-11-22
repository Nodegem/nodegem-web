import { userStore } from './user-store';
import { appStore } from './app-store';
import { ignore } from 'mobx-sync';
import { observable } from 'mobx';
import { editorStore } from 'src/features/Editor 3.0/stores/editor-store';

export class RootStore {

    @ignore
    @observable
    isLoaded: boolean = false;
    
    editor = editorStore;
    app = appStore;
    user = userStore;

    public setEditorState = (state: any) => {
        this.editor = state;
    }
}

export const rootStore = new RootStore();