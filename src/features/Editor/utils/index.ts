import { NodeEditor } from '../rete-engine/editor';

export async function createNode(
    editor: NodeEditor,
    definition: NodeDefinition,
    { data = {}, meta = {}, x, y }
) {
    const component = editor.getComponent(definition.fullName);
    const newNode = await component.createNode(data);

    newNode.position[0] = x;
    newNode.position[1] = y;
    newNode.meta = meta;
    newNode.macroId = definition.macroId;
    newNode.macroFieldId = definition.macroFieldId;

    editor.addNode(newNode);
}
