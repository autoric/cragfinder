var url = require('url'),
    _ = require('underscore');

module.exports = function () {

    return function (req, res, next) {
        var meta = res.meta,
            data = res.data,
            pathname = url.parse(req.originalUrl).pathname,
            prevOffset,
            nextOffset;

        //if this is a list response
        if (meta.count) {
            if (meta.offset !== 0) {
                prevOffset = meta.offset - meta.limit;
                if (prevOffset < 0) {
                    prevOffset = 0;
                }
            }

            nextOffset = meta.offset + meta.limit;
            if (nextOffset > meta.count) {
                nextOffset = undefined;
            }

            if (!_.isUndefined(nextOffset)) {
                meta.next = url.format({
                    pathname: pathname,
                    query: {
                        limit: meta.limit,
                        offset: nextOffset
                    }
                });
            }

            if (!_.isUndefined(prevOffset)) {
                meta.prev = url.format({
                    pathname: pathname,
                    query: {
                        limit: meta.limit,
                        offset: prevOffset
                    }
                });
            }
        }

        return res.json(
            {
                meta: meta,
                data: data
            }
        );
    };
};