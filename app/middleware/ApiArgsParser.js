module.exports = function (constants) {
    return function (req, res, next) {
        var limit = req.query.limit || constants["API.LIMIT"],
            offset = req.query.offset || 0,
            fields = req.query.fields || '';

        req.conditions = {};
        req.fields = fields.split(',').join(' ');
        req.opts = {
            skip: offset,
            limit: limit
        };

        res.meta = {
            offset: offset,
            limit: limit
        };

        return next();
    };
};