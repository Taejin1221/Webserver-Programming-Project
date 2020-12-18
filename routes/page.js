// page.js
const express = require( 'express' );
const { isLoggedIn, isNotLoggedIn } = require( './middlewares' ),
	{ Post, User, Hashtag } = require( '../models' );

const router = express.Router( );

router.use( ( req, res, next ) => {
	res.locals.user = req.user;
	res.locals.followerCount = req.user ? req.user.Followers.length : 0;
	res.locals.followingCount = req.user ? req.user.Followings.length : 0;
	res.locals.followerIdList = req.user ? req.user.Followings.map( f => f.id ) : [ ];
	next();
} );

router.get( '/profile', isLoggedIn, ( req, res ) => {
	res.render( 'profile', { title: 'My Info - LionRoar' } );
} );

router.get( '/join', isNotLoggedIn, ( req, res ) => {
	res.render( 'join', { title: 'Register - LionRoar' } );
} );

router.get( '/myPost', isLoggedIn, async ( req, res, next ) => {
	try {
		const posts = await Post.findAll( {
			include: {
				model: User,
				where: { id: req.user.id },
				attributes: [ 'id', 'nick' ]
			},
			order: [ [ 'createdAt', 'DESC' ] ]
		} );

		res.render( 'mypost', {
			title: 'My Posts - LionRoar',
			feeds: posts
		} );
	} catch ( err ) {
		console.error( err );
		next( err );
	}
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

router.get( '/hashtag', async ( req, res, next ) => {
	const query = req.query.hashtag;
	if ( !query ) {
		return res.redirect( '/' );
	}

	try {
		const hashtag = await Hashtag.findOne( { where: { title: query } } );
		let posts = [ ];
		if ( hashtag ) {
			posts = await hashtag.getPosts( { include: [ { model: User } ] } );
		}

		return res.render( 'main', {
			title: `${query} | LionRoar`,
			feeds: posts
		} );
	} catch ( err ) {
		console.error( err );
		return next( err );
	}
} );

module.exports = router;