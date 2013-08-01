var _ = require('underscore'),
    libxmljs = require('libxmljs'),
    async = require('async');

module.exports = function (Crags, Routes) {

    var ctrl = {};

    ctrl.getKml = function (req, res, next) {
        var kmlDoc = (new libxmljs.Document())
            .node('kml').attr({'xmlns': 'http://www.opengis.net/kml/2.2'});

        async.parallel({
            crags: function (done) {
                Crags.find({}, done);
            },
            routes: function (done) {
                Routes.find({}, done);
            }
        }, function (err, results) {

            if (err) return next(err);
            var crags = results.crags,
                routes = results.routes;

            routes.forEach(function (route) {
                kmlDoc.node('Placemark')
                    .node('name', route.name).parent()
                    .node('description', route.description).parent()
                    .node('Point')
                    .node('coordinates', route.latitude + ',' + route.longitude);
            });

            console.log(kmlDoc.toString());
            res.set('Content-Type', 'application/vnd.google-earth.kml+xml');
            res.send(kmlDoc.toString());
        });
    };

    return ctrl;
}