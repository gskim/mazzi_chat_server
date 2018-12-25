import { ConnectionOptions } from 'typeorm'

const connectionOptions: ConnectionOptions = {
	type: 'postgres',
	database: 'postgres',
	synchronize: true,
	logging: true,
	entities: ['entities/**/*'],
	host: process.env.DB_ENDPOINT,
	port: 5432,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	schema: 'public',
}

export default connectionOptions
