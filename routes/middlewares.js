// middlewares.js
exports.isLoggedIn = ( req, res, next ) => {
	if ( req.isAuthenticated( ) ) {
		next( );
	} else {
		res.status( 403 ).send( 'Need login' );
	}
};

exports.isNotLoggedIn = ( req, res, next ) => {
	if ( !req.isAuthenticated( ) ) {
		next( );
	} else {
		const message = encodeURIComponent( 'Logged in Status' );
		res.redirect( `/?error=${message}` );
	}
};
