// import { NodeData, CanvasData, ConnectorData } from './../features/Editor/NodeCanvas/types.d';
// import { StoreBase, autoSubscribe, AutoSubscribeStore } from 'resub';
// import { IPersistableStore } from 'resub-persist/dist';
// import update from 'immutability-helper';

// const nodeData : CanvasData = {
//     nodes: [
//         { id: "1", title: "goodbye", inputs: [{ label: "Input", id: "10" }, { label: "Input", id: "12" }], outputs: [{label: "Output", id: "1"}], position: [200, 200] },
//         { id: "2", title: "hello", inputs: [{ label: "Input", id: "11" }, { label: "Input", id: "12" }, { label: "Input", id: "13" }], outputs: [{label: "Output", id: "2"}], position: [400, 550] },
//         { id: "3", title: "test", inputs: [{ label: "Input", id: "11" }], outputs: [{label: "Output", id: "2"}], position: [800, 550] },
//         { id: "4", title: "test 2", inputs: [{ label: "Input", id: "11" }], outputs: [{label: "Output", id: "2"}], position: [600, 300] },
//     ],
//     connectors: [
//         { sourceNodeId: "1", sourceFieldId: "1", toNodeId: "2", toFieldId: "13" },
//         { sourceNodeId: "2", sourceFieldId: "2", toNodeId: "3", toFieldId: "11" }
//     ]
// }

// @AutoSubscribeStore
// class EditorStore extends StoreBase implements IPersistableStore {

//     name: string = "EditorStore";    
//     getPropKeys() { return ["_canvasData", "_canvasTransform"];}

//     private _canvasData : CanvasData = nodeData;
//     private _canvasTransform? : [number, number, number] = undefined;

//     public setCanvasTransform([x, y, scale]) {
//         this._canvasTransform = [x, y, scale];
//         this.trigger();
//     }

//     @autoSubscribe
//     public getCanvasTransform() {
//         return this._canvasTransform;
//     }

//     public setCanvasData(data: CanvasData) {
//         this._canvasData = data;
//         this.trigger();
//     }

//     public addNode(node: NodeData) {
//         this._canvasData = update(this._canvasData, {
//             nodes: {
//                 $push: [node]
//             }
//         })
//         this.trigger();
//     }

//     public addConnector(connector: ConnectorData) {
//         this._canvasData = update(this._canvasData, {
//             connectors: {
//                 $push: [connector]
//             }
//         });
//         this.trigger();
//     }

//     @autoSubscribe
//     public getCanvasData() {
//         return this._canvasData;
//     }
// }

// export const editorStore = new EditorStore();