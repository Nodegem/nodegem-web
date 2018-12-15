import { NodeEditor } from '../rete-engine/editor';

export async function createNode(editor: NodeEditor, definition: NodeDefinition, { data = {}, meta = {}, x, y }) {
    const component = editor.getComponent(definition.namespace);
    const newNode = await component.createNode(data);

    newNode.position[0] = x;
    newNode.position[1] = y;
    newNode.meta = meta;

    editor.addNode(newNode);
}