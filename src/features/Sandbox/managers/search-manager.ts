import { action, computed } from 'mobx';
import NodeController from '../Node/node-controller';

export class SearchManager {
    @computed
    public get filteredNodes(): NodeController[] {
        return [];
    }

    @computed
    public get filteredNodeOptions(): SelectFriendly<NodeDefinition> {
        return {};
    }

    private nodeSearchText: string;
    private nodeOptionSearchText: string;

    constructor(
        private getNodes: () => NodeController[],
        private getNodeOptions: () => SelectFriendly<NodeDefinition>
    ) {}

    @action
    public setNodeSearchText = (text: string) => {
        this.nodeSearchText = text;
        console.log(text);
    };

    @action
    public setNodeOptionSearchtext = (text: string) => {
        this.nodeOptionSearchText = text;
    };
}
