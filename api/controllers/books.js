const mongoose = require('mongoose');
const Book =require('../models/book');
const fs = require('fs');



exports.books_get_all = (req, res, next) =>{

	
	Book.find()
	.select('name author _id coverImage publisher isbn')
	.exec()
	.then(books => {

		const response ={

			count: books.length,
			books: books.map(book => {

				return {

					name: book.name, 
					author: book.author,
					coverImage: book.coverImage,
					_id: book._id,
					publisher: book.publisher,
					isbn: book.isbn,
					request: {
						type: 'GET', 
						url: 'http://localhost:3000/books/' + book._id



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
	
	const path = res.locals.baseUrl+'/'+req.file.path.replace("\\", "/"); 

	

	const book = new Book({

		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		author: req.body.author,
		publisher: req.body.publisher,
		isbn: req.body.isbn,
		//cover image
		coverImage: path



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
	.then(book =>{

		console.log("From Database",book);

		

		if(book){

			//res.status(200).json(doc);

			res.status(200).json({

				book: book, 
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


exports.books_update_book = (req, res, next)=>{

	const id = req.params.bookId;
	const updateOps = {}
	for (const ops of req.body){

		updateOps[ops.book] = ops.value;

	}
	Book.update({_id: id}, { $set: updateOps})
	.exec()
	.then(result  =>{

		//console.log(result);
		//res.status(200).json(result);
		res.status(200).json({

			message: 'Book updated',
			request:{
				type: 'GET',
				url: 'http://localhost:3000/books/' + id 

			}
			


		});


	})
	.catch(err =>{

		console.log(err);
		res.status(500).json({

			error: err

		});

	});
	

}

exports.books_delete = (req, res, next)=>{

	
	const id = req.params.bookId;
	Book.remove({_id: id})
	.exec()
	.then(result => {

		


		//res.status(200).json(result);
		res.status(200).json({

			message: 'Book deleted',
			request:{
				type: 'POST',
				url: 'http://localhost:3000/books', 
				body: {name: 'String', author: 'String' , publisher: 'String' , isbn: 'String'}

			}});
	



	})
	.catch(err =>{

		console.log(err);
		res.status(500).json({

			error: err

		});

	});


	
}


exports.books_update_img = (req, res, next)=>{


	console.log(req.file);
	
	const path = res.locals.baseUrl+'/'+req.file.path.replace("\\", "/"); 

	const id = req.params.bookId

	Book.findOne({

		_id: req.params.bookId

	})
	.exec()
	.then(book=>{

		

		if(req.file){

			if(book.coverImage){

				const oldImg = book.coverImage.split("/");



				fs.unlink("uploads\\"+oldImg[4], function() {
			      console.log("image deleted")
	    		});

			}

			


			

		}






		book.coverImage = path;

		book.save()
		.then(book=>{

			res.status(200).json({

				message: 'Book updated',
				request:{
					type: 'GET',
					url: 'http://localhost:3000/books/' + id 

				}
			


			});


		}).catch(err =>{


			console.log(err);
			res.status(500).json({

			error: err

			});



		});


	})
	.catch(err =>{

		console.log(err);
		res.status(500).json({

			error: err

		});


    });




}