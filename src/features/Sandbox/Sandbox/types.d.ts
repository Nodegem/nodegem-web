type Transform = { x: number; y: number; scale: number };
type Vector2 = {
    x: number;
    y: number;
};

type Dimensions = {
    width: number;
    height: number;
};

type Bounds = {
    left: number;
    top: number;
} & Dimensions;

interface IDisposable {
    dispose(): void;
}
