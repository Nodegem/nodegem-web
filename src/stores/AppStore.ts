import { StoreBase, AutoSubscribeStore } from 'resub';
import { IPersistableStore } from 'resub-persist';

@AutoSubscribeStore
class AppStore extends StoreBase implements IPersistableStore {

    name: string = "AppStore";
    getPropKeys: () => string[];

}

export const appStore = new AppStore();