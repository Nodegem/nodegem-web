import { string } from 'prop-types';

declare global {
    interface Array<T> {
        empty(): boolean;
        removeItem(T): T[];
        firstOrDefault(): T | null;
        lastOrDefault(): T | null;
        copy(): T[];
        toDictionary<T>(array: T[], indexKey: keyof T): { [key: string]: T };
    }

    interface String {
        upperCaseFirst(): string;
    }
}

Array.prototype.removeItem = function<T>(item: T): T[] {
    return this.splice(this.indexOf(item), 1);
};

Array.prototype.empty = function(): boolean {
    return this.length <= 0;
};

Array.prototype.firstOrDefault = function<T>(): T | null {
    return !this.empty() ? this[0] : null;
};

Array.prototype.lastOrDefault = function<T>(): T | null {
    return !this.empty() ? this[this.length - 1] : null;
};

Array.prototype.copy = function<T>(): T[] {
    return this.slice(0);
};

Array.prototype.toDictionary = function<T>(array: T[], indexKey: keyof T) {
    const normalizedObject: any = {};
    for (let i = 0; i < array.length; i++) {
        const key = array[i][indexKey];
        normalizedObject[key] = array[i];
    }
    return normalizedObject as { [key: string]: T };
};

String.prototype.upperCaseFirst = function jsUcfirst(): string {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

export {};
