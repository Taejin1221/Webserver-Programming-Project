// app.js
const express = require( 'express' ),
	cookieParser = require('cookie-parser' ),
	morgan = require( 'morgan' ),
	path = require( 'path' ),
	session = require( 'express-session' ),
	nunjucks = require( 'nunjucks' ),
	dotenv = require( 'dotenv' );

dotenv.config();
const pageRouter = require( './routes/page' );
const { sequelize } = require( './models' );

const app = express();

app.set( 'port', process.env.PORT || 8001 );
app.set( 'view engine', 'html' );
nunjucks.configure( 'views', {
	express: app,
	watch: true
} );

sequelize.sync( { force: false } )
	.then( ( ) => {
		console.log( 'Succes to connect DB' );
	} )
	.catch( ( err ) => {
		console.error( err );
	} );

app.use( morgan( 'dev' ) );
app.use( express.static( path.join( __dirname, 'public' ) ) );
app.use( express.json( ) );
app.use( express.urlencoded( { extended : false } ) );
app.use( cookieParser( process.env.COOKIE_SECRET ) );
app.use( session( {
	resave: false,
	saveUninitialized: false,
	secret: process.env.COOKIE_SECRET,
	cookie: {
		httpOnly: true,
		secure: false
	}
} ) );

app.use( '/', pageRouter );

app.use( ( req, res, next ) => {
	const error = new Error( `No ${req.method} ${req.url} router` );
	error.status = 404
	next( error );
} );

app.use( ( err, req, res, next ) => {
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV !== 'production' ? err : { };
	res.status( err.status || 500 );
	res.render( 'error' );
} );

app.listen( app.get( 'port' ), () => {
	console.log( `Waiting at ${app.get( 'port' )} port` );
} );
