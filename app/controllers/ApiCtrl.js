var _ = require('underscore');

module.exports = function (app) {
    var controller = {};

    /*
     Generic CRUD functions for any model
     */
    controller.getAll = function (req, res, next) {
        var query = req.query;
        req.Model.find(req.conditions, req.fields, req.opts, function (err, docs) {
            if (err) return next(err);
            res.data = docs;
            req.Model.count(function (err, count) {
                if (err) return next(err);

                _.extend(res.meta, {
                    count: count
                });

                return next();
            });
        });
    };

    controller.create = function (req, res, next) {
        var model = new req.Model(req.body);
        model.save(function (err, doc) {
            if (err) return next(err);
            res.data = doc;
            return next();
        });
    };

    controller.read = function (req, res, next) {
        var id = req.params.id;

        req.Model.findById(id, req.fields, function (err, doc) {
            if (err) return next(err);
            if (doc === null) return next(404);

            res.data = doc;
            return next();
        });
    };

    controller.replace = function (req, res, next) {
        var id = req.params.id,
            model = new req.Model(req.body);

        model._id = id;
        model.save(function (err, doc) {
            if (err) return next(err);
            res.data = doc;
            return next();
        });
    };

    controller.patch = function (req, res, next) {
        var id = req.params.id;
        req.Model.findById(id, function (err, doc) {
            if (err) return next(err);
            if (doc === null) return next(404);
            _.each(req.body, function (key, value) {
                doc[key] = value;
            });
            doc.save(function (err, doc) {
                if (err) return next(err);
                res.data = doc;
                return next;
            });
        });
    };

    controller.destroy = function (req, res, next) {
        var id = req.params.id;
        req.Model.findByIdAndRemove(id, function (err, doc) {
            if (err) return next(err);
            if (doc === null) return next(404);
            return res.send(204);
        });
    };

    return controller;
};