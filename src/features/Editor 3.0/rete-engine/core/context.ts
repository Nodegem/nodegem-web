import { Emitter } from './emitter'
import { Validator } from './validator'
import { Events } from './events';

export class Context extends Emitter {

    id: string;
    plugins: Map<string, object>;

    constructor(id: string, events: Events) {
        super(events);

        if (!Validator.isValidId(id))
            throw new Error('ID should be valid to name@0.1.0 format');  
        
        this.id = id;
        this.plugins = new Map();
    }

    use(plugin: any, options: any = {}) {
        if (plugin.name && this.plugins.has(plugin.name)) throw new Error(`Plugin ${plugin.name} already in use`)

        plugin.install(this, options);
        this.plugins.set(plugin.name, options)
    }
}