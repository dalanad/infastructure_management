var zlib = require('zlib')

// options
var filter = shouldCompress
let length;
export function CompressionMiddleware(req, res, next) {
    var ended = false
    var listeners = []
    var stream

    var _end = res.end
    var _on = res.on
    var _write = res.write

    // flush
    res.flush = function flush() {
        if (stream) {
            stream.flush()
        }
    }

    // proxy

    res.write = function write(chunk, encoding) {
        if (ended) {
            return false
        }

        if (!this._header) {
            this._implicitHeader()
        }

        return stream
            ? stream.write(toBuffer(chunk, encoding))
            : _write.call(this, chunk, encoding)
    }

    res.end = function end(chunk, encoding) {
        if (ended) {
            return false
        }

        if (!this._header) {
            // estimate the length
            if (!this.getHeader('Content-Length')) {
                length = chunkLength(chunk, encoding)
            }

            this._implicitHeader()
        }

        if (!stream) {
            return _end.call(this, chunk, encoding)
        }

        // mark ended
        ended = true

        // write Buffer for Node.js 0.8
        return chunk
            ? stream.end(toBuffer(chunk, encoding))
            : stream.end()
    }

    res.on = function on(type, listener) {
        if (!listeners || type !== 'drain') {
            return _on.call(this, type, listener)
        }

        if (stream) {
            return stream.on(type, listener)
        }

        // buffer listeners for future stream
        listeners.push([ type, listener ])

        return this
    }

    res.writeHead = createWriteHead(res.writeHead, function onResponseHeaders() {

        var encoding = res.getHeader('Content-Encoding') || 'identity'
        var method = req.get('Accept-Encoding').includes('gzip') ? 'gzip' : 'identity'

        if (!method || method === 'identity' || encoding !== 'identity' || req.method === 'HEAD' || !filter(req, res)) {
            for (var i = 0; i < listeners.length; i++) {
                _on.apply(stream, listeners[ i ])
            }
            listeners = null
            return
        }

        vary(res, 'Accept-Encoding')

        // compression stream
        stream = method === 'gzip' ? zlib.createGzip() : zlib.createDeflate()

        for (var i = 0; i < listeners.length; i++) {
            stream.on.apply(stream, listeners[ i ])
        }

        // header fields
        res.setHeader('Content-Encoding', method)
        res.removeHeader('Content-Length')

        // compression
        stream.on('data', function onStreamData(chunk) {
            if (_write.call(res, chunk) === false) {
                stream.pause()
            }
        })

        stream.on('end', function onStreamEnd() {
            _end.call(res)
        })

        _on.call(res, 'drain', function onResponseDrain() {
            stream.resume()
        })
    })

    next()
}

function chunkLength(chunk, encoding) {
    if (!chunk) {
        return 0
    }
    return !Buffer.isBuffer(chunk) ? Buffer.byteLength(chunk, encoding) : chunk.length
}



function shouldCompress(req, res) {
    var type = res.getHeader('Content-Type')

    if (type === undefined || !compressible(type)) {
        return false
    }

    return true
}


let toBuffer = (chunk, encoding) => !Buffer.isBuffer(chunk) ? Buffer.from(chunk, encoding) : chunk


function vary(res, field) {
    // get existing header
    var val = res.getHeader('Vary') || ''
    var header = Array.isArray(val) ? val.join(', ') : String(val)
    let headers = header.split(", ");
    headers.push(field)
    // set new header
    res.setHeader('Vary', headers.join(", "))
}

var COMPRESSIBLE_TYPE_REGEXP = /^text\/|\+(?:json|text|xml)$/i
var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/

function compressible(type) {
    if (!type || typeof type !== 'string') {
        return false
    }
    // strip parameters
    var match = EXTRACT_TYPE_REGEXP.exec(type)
    var mime = match && match[ 1 ].toLowerCase()
    // fallback to regexp or unknown
    return COMPRESSIBLE_TYPE_REGEXP.test(mime) || mime == 'application/javascript' || undefined
}

function createWriteHead(prevWriteHead, listener) {
    var fired = false
    return function writeHead(statusCode) {
        // fire listener
        if (!fired) {
            fired = true
            listener.call(this)
        }
        return prevWriteHead.apply(this, arguments)
    }
}