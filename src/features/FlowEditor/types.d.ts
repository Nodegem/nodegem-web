import { AnyPort, PortType } from "./Node/Ports/types";

interface DrawingConnection {
    from: AnyPort,
    sourcePos: XYCoords,
    mouse: XYCoords
}