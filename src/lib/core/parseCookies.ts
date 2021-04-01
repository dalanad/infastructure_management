
export function parseCookies(request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[ parts.shift().trim() ] = decodeURIComponent(parts.join('='));
    });

    return list;
}
