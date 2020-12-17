// page.js
const express = require( 'express' );
const { isLoggedIn, isNotLoggedIn } = require( './middlewares' ),
	{ Post, User } = require( '../models' );

const router = express.Router( );

router.use( ( req, res, next ) => {
	res.locals.user = req.usr;
	res.locals.followerCount = 0;
	res.locals.followingCount = 0;
	res.locals.followerIdList = [ ];
	next();
} );

router.get( '/profile', isLoggedIn, ( req, res ) => {
	res.render( 'profile', { title: 'My Info - LionRoar' } );
} );

router.get( '/join', isNotLoggedIn, ( req, res ) => {
	res.render( 'join', { title: 'Register - LionRoar' } );
} );

router.get( '/', async ( req, res, next ) => {
	try {
		const posts = await Post.findAll( {
			include: {
				model: User,
				attributes: [ 'id', 'nick' ]
			},
			order: [ [ 'createdAt', 'DESC' ] ]
		} );

		res.render( 'main', {
			title: 'LionRoar',
			feeds: posts
		} );
	} catch ( err ) {
		console.error( err );
		next( err );
	}
} );

module.exports = router;