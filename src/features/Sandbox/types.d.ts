type SelectFriendly<T> = { [title: string]: T[] | SelectFriendly<T> };
