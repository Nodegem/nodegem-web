import { renderLink, renderPathData, updateLink } from './utils';

export class Picker {
    constructor(editor) {
        this.el = document.createElement('div');
        this.editor = editor;
        this._output = null;
    }

    get output() {
        return this._output;
    }

    set output(val) {
        const { area } = this.editor.view;

        this._output = val;
        if (val !== null) {
            area.appendChild(this.el);
            this.renderLink();
        } else if (this.el.parentElement) {
            area.removeChild(this.el);
            this.el.innerHTML = '';
        }
    }

    getPoints() {
        const mouse = this.editor.view.area.mouse;
        const node = this.editor.view.nodes.get(this.output.node);
        const [x1, y1] = node.getSocketPosition(this.output);

        return [x1, y1, mouse.x, mouse.y];
    }

    updateLink() {
        if (!this.output) return;

        const d = renderPathData(this.editor, this.getPoints());

        updateLink({ el: this.el, d });
    }

    renderLink() {
        if (!this.output) return;

        const d = renderPathData(this.editor, this.getPoints());

        renderLink({ el: this.el, d, link: null });
    }
}
