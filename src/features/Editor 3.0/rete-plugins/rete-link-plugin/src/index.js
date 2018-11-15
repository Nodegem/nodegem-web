import './index.less'
import { Picker } from './picker';
import { defaultPath, renderLink, renderPathData, updateLink } from './utils';

function install(editor) {
    editor.bind('linkpath');
    
    var picker = new Picker(editor)

    function pickOutput(output) {
        if (output) {
            picker.output = output;
            return;
        }
    }

    function pickInput(input) {
        if (picker.output === null) {
            if (input.hasLink()) {
                picker.output = input.links[0].output;
                editor.removeLink(input.links[0]);
            }
            return true;
        }

        if (!input.multipleLinks && input.hasLink())
            editor.removeLink(input.links[0]);
        
        if (!picker.output.multipleLinks && picker.output.hasLink())
            editor.removeLink(picker.output.links[0]);
        
        if (picker.output.connectedTo(input)) {
            var link = input.links.find(c => c.output === picker.output);

            editor.removeLink(link);
        }

        editor.connect(picker.output, input);
        picker.output = null
    }

    function pickLink(link) {
        const { output } = link;

        editor.removeLink(link);
        picker.output = output;
    }

    editor.on('rendersocket', ({ el, input, output }) => {

        var prevent = false;

        function mouseHandle(e) {
            if (prevent) return;
            e.stopPropagation();
            e.preventDefault();
            
            if (input)
                pickInput(input)
            else if (output)
                pickOutput(output)
        }

        el.addEventListener('mousedown', e => (mouseHandle(e), prevent = true));
        el.addEventListener('mouseup', mouseHandle);
        el.addEventListener('click', e => (mouseHandle(e), prevent = false));
        el.addEventListener('mousemove', () => (prevent = false));
    });

    editor.on('mousemove', () => { picker.updateLink() });

    editor.view.container.addEventListener('mousedown', () => { 
        picker.output = null;
    });

    editor.on('renderlink', ({ el, link, points }) => {
        const d = renderPathData(editor, points, link);

        el.addEventListener('contextmenu', e => {
            e.stopPropagation();
            e.preventDefault();
            
            pickLink(link)
        });

        renderLink({ el, d, link })
    });

    editor.on('updatelink', ({ el, link, points }) => {
        const d = renderPathData(editor, points, link);

        updateLink({ el, link, d });
    });
}

export default {
    install,
    defaultPath
}