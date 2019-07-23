export type TFriend = {
    name: string;
    isFavorite: boolean;
    isSingle: boolean;
};

export function createStore() {
    // note the use of this which refers to observable instance of the store
    return {
        friends: [] as TFriend[],
        makeFriend(name, isFavorite = false, isSingle = false) {
            const oldFriend = this.friends.find(friend => friend.name === name);
            if (oldFriend) {
                oldFriend.isFavorite = isFavorite;
                oldFriend.isSingle = isSingle;
            } else {
                this.friends.push({ name, isFavorite, isSingle });
            }
        },
        get singleFriends() {
            return this.friends.filter(friend => friend.isSingle);
        },
    };
}

export type TStore = ReturnType<typeof createStore>;
