var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Animal Model
 * ==========
 */

var Animal = new keystone.List('Animal', {
    map: { name: 'name' },
    autokey: { path: 'slug', from: 'name', unique: true }
});

Animal.add({
    name: { type: String, required: true },
    image: { type: Types.CloudinaryImage },
    content: {type: Types.Html, wysiwyg: true, height: 400 },
    price: {type: Types.Text },
    categories: { type: Types.Relationship, ref: 'AnimalCategory', many: true }
});

Animal.defaultColumns = 'name, price';
Animal.register();
