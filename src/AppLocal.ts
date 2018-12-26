// Dotenv는 최상단에서 실행되어야 다른 파일에서도 참조할 수 있음
import * as dotenv from 'dotenv'
dotenv.config()
import * as http from 'http'
// ORM
import 'reflect-metadata'

import { app, dbConnection } from './App'

class AppLocal {
	private server: any
	private port: number | string | boolean

	constructor(expressApp: any) {
		this.port = this.normalizePort(process.env.PORT || 3000)
		expressApp.set('port', this.port)
		this.server = http.createServer(expressApp)
	}

	public async start() {
		try {
			await dbConnection()
			this.server.listen(this.port)
			this.server.on('error', this.onError.bind(this))
			this.server.on('listening', this.onListening.bind(this))

		} catch (error) {
			// tslint:disable-next-line:no-console
			console.error(error)
			this.onError(error)
		}
	}

	private normalizePort(val: number | string): number | string | boolean {
		const port: number = typeof val === 'string' ? parseInt(val, 10) : val
		if (isNaN(port)) return val
		else if (port >= 0) return port
		else return false
	}

	private onError(error: NodeJS.ErrnoException) {
		if (error.syscall !== 'listen') throw error
		const bind = typeof this.port === 'string' ? 'Pipe ' + this.port : 'Port ' + this.port
		switch (error.code) {
			case 'EACCES':
				// tslint:disable-next-line:no-console
				console.error(`${bind} requires elevated privileges`)
				process.exit(1)
				break
			case 'EADDRINUSE':
				// tslint:disable-next-line:no-console
				console.error(`${bind} is already in use`)
				process.exit(1)
				break
			default:
				throw error
		}
	}

	private onListening() {
		const addr = this.server.address()
		const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
		/* tslint:disable:no-console */
		console.log(`Listening on ${bind}`)
	}
}

const server = new AppLocal(app)
Promise.resolve(server.start())
