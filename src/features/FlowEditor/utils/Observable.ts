import _ from "lodash";

type Action = () => void;

export class Observable {

    private subscriptions : Array<Action> = [];

    public subscribe = (action: Action) => {
        this.subscriptions.push(action);
    }

    public unsubscribe = (action: Action) => {
        _.remove(this.subscriptions, action);
    }

    public execute = () => {
        this.subscriptions.forEach(x => x());
    }
}