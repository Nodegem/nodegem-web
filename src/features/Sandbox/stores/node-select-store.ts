import { Store, compose } from 'overstated';
import { SandboxStore } from '.';
import Fuse from 'fuse.js';
import { Input } from 'antd';

interface INodeSelectionSearchState {
    baseOptions: NodeCache;
    options: NodeCache;
}

export class NodeSelectionSearchStore extends Store<
    INodeSelectionSearchState,
    NodeSelectStore
> {
    public handleSearchChange = async (search: string) => {
        if (!search) {
            this.setState({ options: this.state.baseOptions });
            return;
        }

        const { definitionList } = this.state.baseOptions;
        const filter = new Fuse(definitionList, {
            keys: [
                {
                    name: 'title',
                    weight: 0.7,
                },
                {
                    name: 'fullName',
                    weight: 0.2,
                },
                {
                    name: 'description',
                    weight: 0.1,
                },
            ],
            shouldSort: true,
            caseSensitive: false,
            threshold: 0.45,
            minMatchCharLength: 1,
        });

        const results = filter.search(search).filter(x => !x.ignoreDisplay);
        const definitionObject: NodeCache = {
            definitionList: results,
            definitions: this.state.baseOptions.definitions,
            definitionLookup: definitionList.toDictionary('fullName'),
            selectFriendly: {
                Results: {
                    Matches: results,
                },
            },
        };

        this.setState({
            options: definitionObject,
        });
    };

    public setOptions = (options: NodeCache) => {
        this.setState({ options, baseOptions: options });
    };
}

interface INodeSelectState {
    isOpen: boolean;
    isLoadingDefinitions: boolean;
}

interface INodeSelectChildren {
    nodeSelectionSearchStore: NodeSelectionSearchStore;
}

@compose({
    nodeSelectionSearchStore: NodeSelectionSearchStore,
})
export class NodeSelectStore extends Store<
    INodeSelectState,
    SandboxStore,
    INodeSelectChildren
> {
    public state = {
        isOpen: false,
        isLoadingDefinitions: false,
        nodeOptions: {} as any,
    };

    private inputRef: React.RefObject<Input>;

    public toggleOpen = (value?: boolean) => {
        this.setState({ isOpen: this.state.isOpen.toggle(value) });
    };

    public focusInput = () => {
        if (this.inputRef && this.inputRef.current) {
            this.inputRef.current.focus();
        }
    };

    public setInputRef = (ref: React.RefObject<Input>) => {
        this.inputRef = ref;
    };

    public addNode = (definition: NodeDefinition) => {
        this.ctx.canvasStore.createNodeFromDefinition(definition, true);
    };

    public setNodeOptions = (cache: NodeCache) => {
        this.nodeSelectionSearchStore.setOptions(cache);
    };
}
