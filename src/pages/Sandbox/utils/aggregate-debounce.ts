import _ from 'lodash';

export function aggregateDebounce<T = any, U = any>(
    func: (value: U) => void,
    wait: number,
    mapper: (value: T) => U
) {
    var timeout;
    var args = [] as T[];
    return function(this: any) {
        var context = this;
        args = args.concat(...Array.from(arguments));
        const mappedArgs = args.map(mapper);
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            func.apply(context, mappedArgs);
            args = [];
        }, wait);
    };
}
