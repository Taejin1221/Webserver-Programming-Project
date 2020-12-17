// page.js
const express = require( 'express' );
const { isLoggedIn, isNotLoggedIn } = require( './middlewares' );

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

module.exports = router;