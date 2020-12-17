// localStrategy.js
const passport = require( 'passport' ),
	LocalStrategy = require( 'passport-local' ).Strategy,
	bcrypt = require( 'bcrypt' );

const User = require( '../models/user' );

module.exports = ( ) => {
	passport.use( new LocalStrategy( {
		usernameField: 'email',
		passwordField: 'password'
	}, async ( email, password, done ) => {
		try {
			const exUser = await User.findOne( { where: { email } } );
			if ( exUser ) {
				const result = await bcrypt.compare( password, exUser.password );
				if ( result ) {
					done( null, exUser );
				} else {
					done( null, false, { message: 'Password does not match' } );
				}
			} else {
				done( null, false, { message: 'Not Registered User' } );
			}
		} catch ( err ) {
			console.error( err );
			done( err );
		}
	} ) );
};
