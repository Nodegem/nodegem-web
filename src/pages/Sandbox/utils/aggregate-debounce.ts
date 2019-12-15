import _ from 'lodash';

export function aggregateDebounce<T = any>(
    func: Function,
    wait: number,
    prop: (value: T) => any
) {
    var timeout;
    var args = [] as T[];
    return function(this: any) {
        var context = this;
        args = _.uniqBy(args.concat(...Array.from(arguments)), prop);
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = null;
            func.apply(context, args);
            args = [];
        }, wait);
    };
}
