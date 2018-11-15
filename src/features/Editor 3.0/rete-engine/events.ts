import { Events } from './core/events';

export class EditorEvents extends Events {

    constructor() {
        super({
            nodecreate: [],
            nodecreated: [],
            noderemove: [],
            noderemoved: [],
            linkcreate: [],
            linkcreated: [],
            linkremove: [],
            linkremoved: [],
            nodetranslate: [],
            nodetranslated: [],
            selectnode: [],
            nodeselect: [],
            nodeselected: [],
            rendernode: [],
            rendersocket: [],
            rendercontrol: [],
            renderlink: [],
            updatelink: [],
            componentregister: [],
            keydown: [],
            keyup: [],
            translate: [],
            translated: [],
            zoom: [],
            zoomed: [],
            click: [],
            mousemove: [],
            contextmenu: [],
            import: [],
            export: [],
            process: []
        });
    }    
}