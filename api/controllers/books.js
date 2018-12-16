const mongoose = require('mongoose');
const Book =require('../models/book');




exports.books_get_all = (req, res, next) =>{

	
	Book.find()
	.select('name author _id coverImage')
	.exec()
	.then(docs => {

		const response ={

			count: docs.length,
			books: docs.map(doc => {

				return {

					name: doc.name, 
					author: doc.author,
					coverImage: doc.coverImage,
					_id: doc._id,
					request: {
						type: 'GET', 
						url: 'http://localhost:3000/books/' + doc._id



					}

				}


			})

		};


		

			res.status(200).json(response);

		
		

	})
	.catch(err =>{


		console.log(err);

		res.status(500).json({

			error: err

		});

	});


	


}








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


exports.books_get_book = (req, res, next)=>{

	const id = req.params.bookId; 

	Book.findById(id)
	.select('name author _id coverImage')
	.exec()
	.then(doc =>{

		console.log("From Database",doc);

		

		if(doc){

			//res.status(200).json(doc);

			res.status(200).json({

				book: doc, 
				request: {

					type: 'GET',
					url: 'http://localhost:3000/books'


				}



			});

		}else{


			res.status(404).json({message: 'No valid entry found for provided ID '});

		}

	})
	.catch(err =>{

		console.log(err);
		res.status(500).json({error: err});



	});

	

}