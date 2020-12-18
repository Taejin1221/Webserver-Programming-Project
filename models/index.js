const Sequelize = require( 'sequelize' ),
	env = process.env.NODE_ENV || 'development',
	config = require( '../config/config' )[env];

const User = require( './user' ),
	Post = require( './post' ),
	Hashtag = require( './hashtag' );

const db = { };

const sequelize = new Sequelize( config.database, config.username, config.password, {
	host: 'database-1.cqppsabzq26i.ap-northeast-2.rds.amazonaws.com',
	port: 3306,
	logging: console.log,
	maxConcurrentQueries: 100,
	dialect: 'mysql',
	pool: { maxConnections: 5, maxIdleTime: 30 },
	language: 'en'
} );

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
