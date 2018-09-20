declare global {

    interface Array<T> {
        empty(): boolean;
        firstOrDefault() : T | null;
        copy() : Array<T>;
    }

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