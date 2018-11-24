import { Node } from './node';

export class Selected {

    private list: any[];

    constructor() {
        this.list = [];
    }

    add(item: Node, accumulate: boolean = false) {
        if (accumulate) {
            if (this.contains(item))
                this.remove(item);
            else
                this.list.push(item);
        }
        else
        {
            this.list = [item];    
        }
    }

    clear() {
        this.list = [];
    }

    remove(item) {
        this.list.splice(this.list.indexOf(item), 1);
    }

    contains(item) {
        return this.list.indexOf(item) !== -1;
    }

    each(callback) {
        this.list.forEach(callback);
    }

    getSelected() {
        return this.list;
    }

}