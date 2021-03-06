// post.js
const express = require( 'express' ),
	multer = require( 'multer' ),
	path = require( 'path' ),
	fs = require( 'fs' );

const { User, Post, Hashtag } = require( '../models' );
const { isLoggedIn } = require( './middlewares' );

const router = express.Router();

try {
	fs.readdirSync( 'uploads' );
} catch ( err ) {
	console.error( 'There is no uploads Directory, so make uploads directory' );
	fs.mkdirSync( 'uploads' );
}

const upload = multer( {
	storage: multer.diskStorage( {
		destination ( req, file, cb ) {
			cb( null, 'uploads/' );
		},
		filename ( req, file, cb ) {
			const ext = path.extname( file.originalname );
			cb( null, path.basename( file.originalname, ext ) + Date.now() + ext );
		},
	} ),
	limits: { fileSize: 5 * 1024 * 1024 }
} );

router.post( '/img', isLoggedIn, upload.single( 'img' ), ( req, res ) => {
	console.log( req.file );
	res.json( { url: `/img/${req.file.filename}` } );
} );

const upload2 = multer( );
router.post( '/', isLoggedIn, upload2.none(), async ( req, res, next ) => {
	try {
		const post = await Post.create( {
			content: req.body.content,
			img: req.body.url,
			UserId: req.user.id,
			hits: 0
		} );

		const hashtags = req.body.content.match( /#[^\s#]*/g );
		if ( hashtags ) {
			const result = await Promise.all(
				hashtags.map( tag => {
					return Hashtag.findOrCreate( {
						where: { title: tag.slice( 1 ).toLowerCase( ) },
					} )
				} )
			);

			await post.addHashtags( result.map( r => r[0] ) );
		}

		res.redirect( '/' );
	} catch( err ) {
		console.error( err );
		next( err );
	}
} );

router.post( '/:feed/hits/', isLoggedIn, async ( req, res, next ) => {
	try {
		const post = await Post.findOne( { where: { id: req.params.feed } } );
		await Post.update( {
			hits: post.hits + 1
		}, {
			where: { id: req.params.feed }
		} );

		res.redirect( '/' );
	} catch ( err ) {
		console.error( err );
		next( err );
	}
} );

router.post( '/:feed/init/', isLoggedIn, async ( req, res, next ) => {
	try {
		const post = await Post.findOne( { where: { id: req.params.feed } } );
		await Post.update( {
			hits: 0
		}, {
			where: { id: req.params.feed }
		} );

		res.redirect( '/' );
	} catch( err ) {
		console.error( err );
		next( err );
	}
} );

module.exports = router;
