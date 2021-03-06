declare global {
    // tslint:disable-next-line: interface-name
    interface Array<T> {
        empty(): boolean;
        removeItem(T): T[];
        removeWhere(predicate: (item: T) => boolean): void;
        first(predicate?: (item: T) => boolean): T;
        firstOrDefault(predicate?: (item: T) => boolean): T | undefined;
        lastOrDefault(): T | null;
        copy(): T[];
        replace(predicate: (item: T) => boolean, newVal: T): T[];
        toDictionary(indexKey: keyof T): { [key: string]: T };
        count(predicate?: (item: T) => boolean): number;
        any(predicate?: (item: T) => boolean): boolean;
        addOrUpdate(value: T, predicate: (value: T) => boolean): void;
    }

    // tslint:disable-next-line: interface-name
    interface String {
        upperCaseFirst(): string;
        removeAfter(char: string): string;
    }

    // tslint:disable-next-line: interface-name
    interface Boolean {
        toggle(value?: boolean): boolean;
    }
}

Array.prototype.removeItem = function<T>(item: T): T[] {
    return this.splice(this.indexOf(item), 1);
};

Array.prototype.removeWhere = function<T>(
    predicate: (item: T) => boolean
): void {
    const items = this.filter(predicate);
    for (const i of items) {
        this.removeItem(i);
    }
};

Array.prototype.empty = function(): boolean {
    return this.length <= 0;
};

Array.prototype.firstOrDefault = function<T>(
    predicate?: (item: T) => boolean
): T | null {
    return !this.empty()
        ? !!predicate
            ? this.filter(predicate)[0]
            : this[0]
        : null;
};

Array.prototype.first = function<T>(predicate?: (item: T) => boolean): T {
    return !this.empty()
        ? !!predicate
            ? this.filter(predicate)[0]
            : this[0]
        : null;
};

Array.prototype.lastOrDefault = function<T>(): T | null {
    return !this.empty() ? this[this.length - 1] : null;
};

Array.prototype.copy = function<T>(): T[] {
    return this.slice(0);
};

// tslint:disable-next-line: only-arrow-functions
Array.prototype.toDictionary = function<T>(indexKey: keyof T) {
    const normalizedObject: any = {};
    for (let i = 0; i < this.length; i++) {
        const key = this[i][indexKey];
        normalizedObject[key] = this[i];
    }
    return normalizedObject as { [key: string]: T };
};

Array.prototype.replace = function<T>(
    predicate: (item: T) => boolean,
    newVal: T
): T[] {
    const copy = [...this];
    const index = copy.findIndex(predicate);
    if (index !== -1) {
        copy[index] = newVal;
    }
    return copy;
};

Array.prototype.count = function<T>(predicate?: (item: T) => boolean): number {
    return predicate ? this.filter(predicate).length : this.length;
};

Array.prototype.any = function<T>(predicate?: (item: T) => boolean): boolean {
    return predicate ? this.some(predicate) : this.length > 0;
};

Array.prototype.addOrUpdate = function<T>(
    value: T,
    predicate: (value: T) => boolean
) {
    if (!this.any(predicate)) {
        this.push(value);
    } else {
        const index = this.findIndex(predicate);
        this[index] = value;
    }
};

String.prototype.upperCaseFirst = function jsUcfirst(): string {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.removeAfter = function removeAfter(char: string): string {
    const index = this.indexOf(char);
    return index > -1 ? this.slice(0, index) : this.slice();
};

Boolean.prototype.toggle = function toggle(value?: boolean): boolean {
    return value === undefined ? !this : value;
};

export {};
