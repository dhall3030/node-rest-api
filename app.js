const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


//load routes 


const userRoutes = require('./api/routes/users');
const bookRoutes = require('./api/routes/books');

//DB Config
//Connect to mongoose 
mongoose.connect('mongodb://localhost/noderestapi', {

	//useMongoClient: true
	useNewUrlParser: true

})
.then(() => console.log('MongoDB Connected...'))
.catch(err =>console.log(err));
	

mongoose.Promise = global.Promise;

//morgan
app.use(morgan('dev'));
//upload folder
app.use('/uploads',express.static('uploads'));

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Handling CORS
app.use((req, res,next) =>{


	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');

	if(req.method === 'OPTIONS'){

		res.header('Access-Control-Allow-Methods','*PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});

	}

	next();

});



app.use((req, res,next) =>{

	res.locals.baseUrl = req.protocol+'://'+req.headers.host;
	return next();

});



//routes that should handle requests 

app.use('/users', userRoutes);
app.use('/books', bookRoutes);




//error handling
app.use((req, res, next)=>{

	const error = new Error('Not found');
	error.status = 404;
	next(error)

})

app.use((error, req, res, next)=>{

	res.status(error.status || 500);
	res.json({

		error:{

			message: error.message

		}

	});

});




module.exports = app;