export abstract class Component {

    public name: string;
    data: object;

    constructor(name: string) {
        this.name = name;
        this.data = {};
    }

}