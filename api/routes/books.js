const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const BookController = require('../controllers/books');


const storage = multer.diskStorage({

	destination: function(req, file, cb) {

		cb(null, './uploads/'); 

	},
	filename: function(req, file, cb) {
		cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
		

	}
});


const fileFilter = (req, file,cb) => {

	//reject a file
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){

		cb(null, true); 

	}else{

		cb(null, false);

	}

};


const upload = multer({ 

	storage: storage , 
	limits:{

		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter


});

router.get('/', BookController.books_get_all);

router.post('/', checkAuth , upload.single('coverImage') , BookController.books_create_book);

router.get('/:bookId', BookController.books_get_book); 

router.patch('/:bookId', checkAuth , BookController.books_update_book);

router.delete('/:bookId', checkAuth , BookController.books_delete);

module.exports = router;