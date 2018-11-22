import { observable } from "mobx";

class EditorStore {

    @observable
    activeTabKey: number = 0;

    @observable
    tabs: { [tabKey: number] : { title: string, closable: boolean }} = {
        0: { title: "Tab 1", closable: false }
    };

}

export const editorStore = new EditorStore(); 