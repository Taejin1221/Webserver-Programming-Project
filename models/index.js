const Sequelize = require( 'sequelize' ),
	env = process.env.NODE_ENV || 'development',
	config = require( '../config/config' )[env];

const User = require( './user' ),
	Post = require( './post' ),
	Hashtag = require( './hashtag' );

const db = { };

const sequelize = new Sequelize( config.database, config.username, config.password, config );

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init( sequelize );
Post.init( sequelize );
Hashtag.init( sequelize );

User.associate( db );
Post.associate( db );
Hashtag.associate( db );

module.exports = db;
