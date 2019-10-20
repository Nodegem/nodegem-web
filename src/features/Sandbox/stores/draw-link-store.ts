import { Store } from 'overstated';
import { CanvasStore } from '.';

interface IDrawLinkState {
    isDrawing: boolean;
    linkType?: PortType;
}

export class DrawLinkStore extends Store<IDrawLinkState, CanvasStore> {
    public state: IDrawLinkState = {
        isDrawing: false,
    };
}
