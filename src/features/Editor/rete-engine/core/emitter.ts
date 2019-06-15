import { Events } from './events';

export class Emitter {
    events: Events | object;
    silent: boolean;

    constructor(events: Events | Emitter) {
        this.events =
            events instanceof Emitter ? events.events : events.handlers;
        this.silent = false;
    }

    public on(names: string, handler: (...param: any[]) => any): Emitter {
        names.split(' ').forEach(name => {
            if (!this.events[name])
                throw new Error(`The event ${name} does not exist`);
            this.events[name].push(handler);
        });

        return this;
    }

    public trigger(name: string, ...params: any[]): any {
        if (!(name in this.events))
            throw new Error(`The event ${name} cannot be triggered`);

        return this.events[name].reduce((r, e) => {
            let result = params.length > 1 ? e(...params) : e(params[0]); // backwards compatibility
            return result !== false && r;
        }, true); // return false if at least one event is false
    }

    public bind(name: string): void {
        this.events[name] = [];
    }
}
