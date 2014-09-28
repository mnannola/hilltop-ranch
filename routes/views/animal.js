var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res) {
    
    var view = new keystone.View(req, res),
    locals = res.locals;

    // Set locals
    locals.section = 'prices';
    locals.filters = {
        animal: req.params.animal
    };
    locals.data = {
        animals: []
    };

    // Load the current animal
    view.on('init', function(next) {
        
        var q = keystone.list('Animal').model.findOne({
            slug: locals.filters.animal
        }).populate('categories');

        q.exec(function(err, result) {
            locals.data.animal = result;
            next(err);
        });
    });

    // Load other animals
    view.on('init', function(next) {
        
        var q = keystone.list('Animal').model.find();

        q.exec(function(err, results) {
            locals.data.animals = results;
            next(err);
        });
    });

    // Render the view
    view.render('animal');
};
