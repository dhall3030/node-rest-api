const mongoose = require('mongoose');
const Book =require('../models/book');

exports.books_create_book = (req, res, next) =>{ 

	
	console.log(req.file);
	const book = new Book({

		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		author: req.body.author,
		publisher: req.body.publisher,
		isbn: req.body.isbn,
		//cover image
		coverImage: req.file.path



	});
	book
	.save()
	.then(result=>{

		console.log(result);
		res.status(201).json({

			message: 'Created Book successfully',
			//createdProduct: result
			createdBook: {

				name: result.name, 
				author: result.author, 
				publisher: result.publisher,
				isbn: result.isbn,
				_id: result._id,
				request: {

					type: 'GET', 
					url: 'http://localhost:3000/books/' + result._id

				}


			}

		});

	})
	.catch(err => {

		console.log(err);
		res.status(500).json({

			error: err

		});


	});

	


}