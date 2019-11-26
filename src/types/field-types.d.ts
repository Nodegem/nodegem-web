interface BaseFieldDto {
    key: string;
    label: string;
}

interface ValueFieldDto extends BaseFieldDto {
    type: ValueType;
}

interface ValueInputFieldDto extends ValueFieldDto {
    defaultValue: any;
}

interface ValueOutputFieldDto extends ValueFieldDto {}

interface FlowFieldDto extends BaseFieldDto {}
interface FlowInputFieldDto extends FlowFieldDto {}
interface FlowOutputFieldDto extends FlowFieldDto {}
