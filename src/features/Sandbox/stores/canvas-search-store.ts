import { Store } from 'overstated';
import { CanvasStore } from '.';
import Fuse from 'fuse.js';

export class CanvasSearchStore extends Store<{}, CanvasStore> {
    public handleSearchChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { nodes } = this.ctx.state;

        if (!event.target || !event.target.value) {
            this.suspend();
            nodes.forEach(x => {
                this.ctx.updateNode(x.id, _ => ({
                    isFaded: false,
                }));
            });
            this.unsuspend();
            return;
        }

        const filter = new Fuse(nodes, {
            caseSensitive: false,
            keys: ['title'],
            threshold: 0.5,
            minMatchCharLength: 1,
        });

        const results = filter.search(event.target.value);

        this.suspend();
        const nonResults = nodes.filter(n => !results.any(x => x.id === n.id));
        nonResults.forEach(x => {
            this.ctx.updateNode(x.id, _ => ({
                isFaded: true,
            }));
        });
        results.forEach(x => {
            this.ctx.updateNode(x.id, _ => ({
                isFaded: false,
            }));
        });
        this.unsuspend();
    };
}
