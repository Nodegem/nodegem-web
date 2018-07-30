import { StoreBase } from 'resub';
import { IPersistableStore } from '../../node_modules/resub-persist/dist';

export default class EditorStore extends StoreBase implements IPersistableStore {

    name: string = "EditorStore";    
    getPropKeys: () => string[];

}