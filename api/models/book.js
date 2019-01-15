const mongoose = require('mongoose'); 

const bookSchema = mongoose.Schema({

	_id: mongoose.Schema.Types.ObjectId, 
	name:  { type: String, required: true },
	author: { type: String, required: true },
	publisher: { type: String, required: true },
	isbn: { type: String, required: true },
	coverImage: { type: String, required: false}
	

});


module.exports = mongoose.model('Book', bookSchema);