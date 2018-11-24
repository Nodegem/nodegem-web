export class Events {

    handlers: any;

    constructor(handlers) {
        this.handlers = {
            warn: [console.warn],
            error: [console.error],
            ...handlers
        };
    }    
}