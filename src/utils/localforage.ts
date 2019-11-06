import localforage from 'localforage';

export const hasItem = async (key: string): Promise<boolean> => {
    return (await localforage.getItem(key)) !== undefined;
};
