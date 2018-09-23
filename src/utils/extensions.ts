declare global {

    interface Array<T> {
        empty(): boolean;
        removeItem(T): Array<T>;
        firstOrDefault() : T | null;
        copy() : Array<T>;
    }

}

Array.prototype.removeItem = function<T>(item: T) : Array<T> {
    return this.filter(x => x !== item);
}

Array.prototype.empty = function() : boolean {
    return this.length <= 0;    
}

Array.prototype.firstOrDefault = function<T>() : T | null {
    return !this.empty() ? this[0] : null;    
}

Array.prototype.copy = function<T>() : Array<T> {
    return this.slice(0);    
}

export {}