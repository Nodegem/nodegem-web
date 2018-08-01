export type Vector2 = {
    x: number;
    y: number;
}

export type EventHandler<T> = (e: T) => boolean;