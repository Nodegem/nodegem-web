export interface PortProps {
    ioType: IOType;
    fieldKey: string;
    onDelete?: (ioType: IOType, id: string) => void;
    onChange?: (state: any) => void;
}
