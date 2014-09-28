var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * AnimalCategory Model
 * ====================
 */

var AnimalCategory = new keystone.List('AnimalCategory', {
    autokey: { from: 'name', path: 'key', unique: true }
});

AnimalCategory.add({
    name: { type: String, required: true }
});

AnimalCategory.relationship({ ref: 'Animal', path: 'categories' });

AnimalCategory.register();
