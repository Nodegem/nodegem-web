export const saveToStorage = (key: string, value: any) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

export const getFromStorage = <T>(key: string) => {
    const value = window.localStorage.getItem(key);
    if (!value) {
        return null;
    }
    return JSON.parse(value) as T;
};

export const deleteFromStorage = (...keys: string[]) => {
    keys.forEach(k => window.localStorage.removeItem(k));
};

export const clearStorage = () => {
    window.localStorage.clear();
};
