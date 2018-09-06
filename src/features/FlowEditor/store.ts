import { observable } from "mobx";
import { DrawingConnection } from ".";
import { CanvasThing } from "./Canvas/CanvasThing";

class FlowEditorStore {
    @observable nodes: {}[];
    @observable connections: {}[];
    @observable currentConnection: DrawingConnection;

    canvas: CanvasThing;
}

export const store = new FlowEditorStore();