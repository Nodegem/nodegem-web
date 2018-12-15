import { observable, action } from "mobx";

class EditorMenuStore {

    
    trackPosition: boolean = true;
    position: { x: number, y: number }

    setPosition(x: number, y: number) {
        this.position = { x, y };
    }

    setTracking(tracking: boolean) {
        this.trackPosition = tracking;
    }

}

export default new EditorMenuStore();