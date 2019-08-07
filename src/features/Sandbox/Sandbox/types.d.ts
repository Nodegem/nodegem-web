type Transform = { x: number; y: number; scale: number };
type Vector2 = {
    x: number;
    y: number;
};

type Dimensions = {
    width: number;
    height: number;
};

interface IDisposable {
    dispose(): void;
}
