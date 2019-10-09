export function isSelectFriendly<T>(
    value: Array<T> | SelectFriendly<T>
): value is SelectFriendly<T> {
    return !Array.isArray(value);
}
