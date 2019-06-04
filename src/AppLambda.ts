// import { APIGatewayEvent, Context } from 'aws-lambda'
// import * as awsServerlessExpress from 'aws-serverless-express'
// import 'reflect-metadata'
// import { dbConnection, server as app } from './App'

// let server: any

// async function createServer() {
// 	try {
// 		await dbConnection()
// 		server = awsServerlessExpress.createServer(app)
// 	} catch (error) {
// 		server = null
// 		// tslint:disable-next-line:no-console
// 		console.error(error)
// 	}
// }

// export function handler(event: APIGatewayEvent, context: Context) {
// 	(async () => {
// 		if (!server) {
// 			await createServer()
// 		}
// 		awsServerlessExpress.proxy(server, event, context)
// 	})()
// }
