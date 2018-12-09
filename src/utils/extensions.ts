declare global {
  interface Array<T> {
    empty(): boolean;
    removeItem(T): Array<T>;
    firstOrDefault(): T | null;
    lastOrDefault(): T | null;
    copy(): Array<T>;
  }

  interface String {
    upperCaseFirst(): string
  }
}

Array.prototype.removeItem = function<T>(item: T): Array<T> {
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

Array.prototype.copy = function<T>(): Array<T> {
  return this.slice(0);
};

String.prototype.upperCaseFirst = function jsUcfirst(): string {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

export {};
