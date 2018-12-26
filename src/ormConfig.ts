import { ConnectionOptions } from 'typeorm'

const connectionOptions: ConnectionOptions = {
	type: 'postgres',
	database: process.env.DB_DATABASE,
	synchronize: process.env.DB_SYNC === 'true' ? true : false,
	logging: true,
	entities: [__dirname + '/entities/**/*.ts', __dirname + '/entities/**/*.js'],
	migrations: [__dirname + '/migrations/*.ts', __dirname + '/migrations/*.js'],
	host: process.env.DB_ENDPOINT,
	port: 5432,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	schema: 'public',
}

export default connectionOptions
