import { Request, Response } from 'express'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import User from '../entities/User'
import decodeJWT from '../utils/decodeJWT'

@Middleware({ type: 'before' })
export class UserMiddlewares implements ExpressMiddlewareInterface {
	public async use(request: Request, response: Response, next: (err?: any) => any): Promise<any> {
		if (request.url === '/graphql' && request.headers.authorization) {
			const token = request.headers.authorization.replace(/^Bearer\s/, '').trim()
			if (token) {
				const user: User|undefined = await decodeJWT(request.headers.authorization.replace(/^Bearer\s/, '').trim())
				if (user) {
					return user
				} else {
					return undefined
				}
			}
		} else {
			return undefined
		}

		next()
	}
}
