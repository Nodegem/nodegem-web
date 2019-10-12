type SelectFriendly<T> = { [title: string]: T[] | SelectFriendly<T> };
type TabData = { graph: Graph | Macro; isDirty: boolean };
