type Methods =
    'ACL'
    | 'BIND'
    | 'CHECKOUT'
    | 'CONNECT'
    | 'COPY'
    | 'DELETE'
    | 'GET'
    | 'HEAD'
    | 'LINK'
    | 'LOCK'
    | 'M-SEARCH'
    | 'MERGE'
    | 'MKACTIVITY'
    | 'MKCALENDAR'
    | 'MKCOL'
    | 'MOVE'
    | 'NOTIFY'
    | 'OPTIONS'
    | 'PATCH'
    | 'POST'
    | 'PRI'
    | 'PROPFIND'
    | 'PROPPATCH'
    | 'PURGE'
    | 'PUT'
    | 'REBIND'
    | 'REPORT'
    | 'SEARCH'
    | 'SOURCE'
    | 'SUBSCRIBE'
    | 'TRACE'
    | 'UNBIND'
    | 'UNLINK'
    | 'UNLOCK'
    | 'UNSUBSCRIBE';

type Pattern = RegExp | string;

interface ITrouter<T = Function> {
    find(method: Methods, url: string): { params: Record<string, string>; handlers: T[]; };

    add(method: Methods, pattern: Pattern, ...handlers: T[]): this;

    use(pattern: Pattern, ...handlers: T[]): this;

    all(pattern: Pattern, ...handlers: T[]): this;

    get(pattern: Pattern, ...handlers: T[]): this;

    head(pattern: Pattern, ...handlers: T[]): this;

    patch(pattern: Pattern, ...handlers: T[]): this;

    options(pattern: Pattern, ...handlers: T[]): this;

    connect(pattern: Pattern, ...handlers: T[]): this;

    delete(pattern: Pattern, ...handlers: T[]): this;

    trace(pattern: Pattern, ...handlers: T[]): this;

    post(pattern: Pattern, ...handlers: T[]): this;

    put(pattern: Pattern, ...handlers: T[]): this;
}

import { parseParam } from './param';

interface Route {
    keys: any;
    pattern: RegExp;
    method: string;
    handlers: any[]
}

export default class Router implements ITrouter {
    routes: Route[] = [];

    all = this.add.bind(this, '');
    get = this.add.bind(this, 'GET');
    head = this.add.bind(this, 'HEAD');
    patch = this.add.bind(this, 'PATCH');
    options = this.add.bind(this, 'OPTIONS');
    connect = this.add.bind(this, 'CONNECT');
    delete = this.add.bind(this, 'DELETE');
    trace = this.add.bind(this, 'TRACE');
    post = this.add.bind(this, 'POST');
    put = this.add.bind(this, 'PUT');

    constructor(op: any) {
    }

    use(route, ...fns) {
        let handlers = [].concat.apply([], fns);
        let { keys, pattern } = parseParam(route, true);
        this.routes.push({ keys, pattern, method: '', handlers });
        return this;
    }

    add(method, route, ...fns) {
        let { keys, pattern } = parseParam(route);
        let handlers = [].concat.apply([], fns);
        this.routes.push({ keys, pattern, method, handlers });
        return this;
    }

    find(method, url) {
        let isHEAD = (method === 'HEAD');
        let i = 0, j = 0, k, tmp: Route, arr = this.routes;
        let matches = [], params = {}, handlers = [];
        for (; i < arr.length; i++) {
            tmp = arr[i];
            if (tmp.method.length === 0 || tmp.method === method || isHEAD && tmp.method === 'GET') {
                if (tmp.keys === false) {
                    matches = tmp.pattern.exec(url);
                    if (matches === null) continue;
                    // @ts-ignore
                    if (matches.groups !== void 0) for (k in matches.groups) params[k] = matches.groups[k];
                    tmp.handlers.length > 1 ? (handlers = handlers.concat(tmp.handlers)) : handlers.push(tmp.handlers[0]);
                } else if (tmp.keys.length > 0) {
                    matches = tmp.pattern.exec(url);
                    if (matches === null) continue;
                    for (j = 0; j < tmp.keys.length;) params[tmp.keys[j]] = matches[++j];
                    tmp.handlers.length > 1 ? (handlers = handlers.concat(tmp.handlers)) : handlers.push(tmp.handlers[0]);
                } else if (tmp.pattern.test(url)) {
                    tmp.handlers.length > 1 ? (handlers = handlers.concat(tmp.handlers)) : handlers.push(tmp.handlers[0]);
                }
            } // else not a match
        }

        return { params, handlers };
    }
}