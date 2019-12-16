import * as Yup from 'yup';

declare module 'yup' {
    // tslint:disable-next-line
    interface ArraySchema<T> {
        unique(mapper: (a: any) => any, message?: any): ArraySchema<T>;
    }
}

Yup.addMethod(Yup.array, 'unique', function(
    mapper = (a: any) => a,
    message: string = '${path} must be unique'
) {
    return this.test('unique', message, list => {
        return list.length === new Set(list.map(mapper)).size;
    });
});
