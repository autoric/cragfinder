module.exports = function (app, config, middleware) {
    console.log('[express train application listening on %s]', config.port);
    return app.listen(config.port);
}