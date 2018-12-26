import { APIGatewayEvent, Context } from 'aws-lambda'
import * as awsServerlessExpress from 'aws-serverless-express'
// ORM
import 'reflect-metadata'
import { app, dbConnection } from './App'

let server: any

async function createServer() {
	try {
		const a = await dbConnection()
		console.log('=============================')
		console.log(a)
		server = awsServerlessExpress.createServer(app)
	} catch (error) {
		server = null
		// tslint:disable-next-line:no-console
		console.error(error)
	}
}

export function handler(event: APIGatewayEvent, context: Context) {
	(async () => {
		console.log(process.env)
		if (!server) {
			await createServer()
		}
		awsServerlessExpress.proxy(server, event, context)
	})()
}
