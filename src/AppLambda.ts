import { APIGatewayEvent, Context } from 'aws-lambda'
import * as awsServerlessExpress from 'aws-serverless-express'
import 'reflect-metadata'
import { app, dbConnection } from './App'

let server: any

async function createServer() {
	try {
		console.log('-------------')
		await dbConnection()
		console.log('=============')
		server = awsServerlessExpress.createServer(app)
		console.log('++++++++++++++')
	} catch (error) {
		server = null
		// tslint:disable-next-line:no-console
		console.error(error)
	}
}

export function handler(event: APIGatewayEvent, context: Context) {
	(async () => {
		console.log('handler')
		if (!server) {
			await createServer()
		}
		awsServerlessExpress.proxy(server, event, context)
	})()
}
