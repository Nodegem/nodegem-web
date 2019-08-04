import Moveable from '../interactive/moveable';

class NodeController<TNode> {
    public get position(): Vector2 {
        return this.moveable.position;
    }

    public get nodeData(): TNode {
        return this._nodeData;
    }

    private moveable: Moveable;

    constructor(private containerElement: Element, private _nodeData: TNode) {
        this.moveable = new Moveable(containerElement);
    }
}

export default NodeController;
