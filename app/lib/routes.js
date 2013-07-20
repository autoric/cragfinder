//var resource = require('express-resource');

module.exports = function (app, models, ApiCtrl, HomeController, ApiArgsParser, ApiResponseFormatter, ApiErrorMiddleware) {

    // Home
    //app.resource(app.controllers.home);
    app.get('/', HomeController.index);

    //Generic restful api for all models - if previous routes are not matched, will fall back to these
    //See libs/params.js, which adds param middleware to load & set req.Model based on :model argument
    app.all('/api/*', ApiArgsParser);

    app.get('/api/:model', ApiCtrl.getAll);
    app.post('/api/:model', ApiCtrl.create);
    app.get('/api/:model/:id', ApiCtrl.read);
    app.post('/api/:model/:id', ApiCtrl.update);
    app.del('/api/:model/:id', ApiCtrl.destroy);

    app.all('/api/*', ApiResponseFormatter);

    app.param('model', function (req, res, next, model) {
        model = model.charAt(0).toUpperCase() + model.slice(1);
        var Model = models[model];
        if (Model === undefined) {
            //if the request is for a model that does not exist, 404
            res.data = {
                developerMessage: 'The specified model ' + model + ' could not be found.',
                userMessage: 'The request page could not be found.',
                error: '404'
            };
            return next(404);
        }
        req.Model = Model;
        return next();
    });
};