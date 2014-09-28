var keystone = require('keystone'),
    async = require('async');

exports = module.exports = function(req, res) {
    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'pricing';
    locals.filters = {
        category: req.params.category
    };
    locals.data = {
        animals: [],
        categories: []
    };

    // Load all categories
    view.on('init', function(next) {
        keystone.list('AnimalCategory').model.find().sort('name').exec(function(err, results) {
            if(err || !results.length) {
                return next(err);
            }

            locals.data.categories = results;

            // Load the counts for each category
            async.each(locals.data.categories, function(category, next) {
                keystone.list('Animal').model.count().where('category').in([category.id]).exec(function(err, count) {
                    category.animalCount = count;
                    next(err);
                });
            }, function(err) {
                next(err);
            });
                
        });
    });

    //Load the current category filter
    view.on('init', function(next) {
        if(req.params.category) {
            keystone.list('AnimalCategory').model.findOne({ key: locals.filters.category }).exec(function(err, result) {
                locals.data.category = result;
                next(err);
            });
        } else {
            next();
        }
    });

    // Load the Animals
    view.on('init', function(next) {
        var q = keystone.list('Animal').paginate({
                page: req.query.page || 1,
                perPage: 10,
                maxPages: 10
                })
                .sort('name')
                .populate('categories');

        if (locals.data.category) {
            q.where('categories').in([locals.data.category]);
        }

        q.exec(function(err, results) {
            locals.data.animals = results;
            next(err);
        });
    });

    view.render('animals');
};
