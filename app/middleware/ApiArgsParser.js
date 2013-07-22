var _ = require('underscore')

module.exports = function (constants) {
    return function (req, res, next) {
        var limit = _.isNaN(parseInt(req.query.limit)) ? constants["API.LIMIT"] : parseInt(req.query.limit),
            offset = parseInt(req.query.offset) || 0,
            fields = req.query.fields || '';

        req.conditions = {};
        req.fields = fields.split(',').join(' ');
        req.opts = {
            skip: offset,
            limit: limit
        };

        res.meta = {
            fields: fields,
            offset: offset,
            limit: limit
        };

        return next();
    };
};