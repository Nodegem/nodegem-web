export type SimpleObservableAction<T> = (T) => void;
export class SimpleObservable<T = void> {

    private actions: Array<SimpleObservableAction<T>> = [];

    public subscribe = (action: SimpleObservableAction<T>) => {
        this.actions.push(action);
    }

    public unsubscribe = (action: SimpleObservableAction<T>) => {
        this.actions.removeItem(action);
    }

    public execute = (data : T) => {
        this.actions.forEach(x => x(data));
    }

    public clear = () => {
        this.actions = [];
    }

}