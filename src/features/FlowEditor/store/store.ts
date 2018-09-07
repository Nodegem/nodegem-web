import { observable } from "mobx";
import { CanvasThing } from "../Canvas/CanvasThing";
import { Link } from "../Link";
import { DrawingConnection } from "../types";
import { Node } from '../Node';

class FlowEditorStore {
    @observable nodes: Array<Node> = [];
    @observable links: Array<Link> = [];
    @observable currentConnection: DrawingConnection;

    canvas: CanvasThing;
}

export const store = new FlowEditorStore();