export class OperationsUtil {
    public get hasOperations() {
        return this.allOperations.any();
    }

    public allOperations: StateOperations[] = [];
    private _operation?: StateOperations;

    public canAddOperations = false;

    public beginOperationTransaction = () => {
        if (this.canAddOperations) {
            this._operation = {};
        }
    };

    public endOperationTransaction = () => {
        const returnOperation = { ...this._operation };
        this._operation = undefined;
        this.allOperations.push(returnOperation);
    };

    public addOperation = (type: keyof StateOperations, ops: Op[]) => {
        if (this._operation) {
            if (this._operation[type]) {
                this._operation[type] = [...this._operation[type]!, ...ops];
            } else {
                this._operation[type] = ops;
            }
            return;
        }

        if (this.canAddOperations) {
            this.allOperations.push({ [type]: ops });
        }
    };

    public popOp = () => {
        return this.allOperations.pop();
    };

    public clearOps = () => {
        this.allOperations = [];
    };
}
