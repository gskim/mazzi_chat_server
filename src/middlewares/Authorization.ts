import * as jwt from 'jsonwebtoken'
import { Action } from 'routing-controllers'
import { AuthChecker } from 'type-graphql';
import { Context } from '../App';
import User from '../entities/User'
import decodeJWT from '../utils/decodeJWT'

export interface Authorization {
	authorizeChecker(action: Action): Promise<boolean>
	currentUserChecker(action: Action): Promise<User>
}

export class Authorization implements Authorization {

	public async authorizeChecker(action: Action): Promise<boolean> {
		if (action.request.headers.authorization) {
			if (decodeJWT(action.request.headers.authorization.replace(/^Bearer\s/, '').trim())) {
				return true
			} else {
				return false
			}
		} else {
			return false
		}
	}

	public async currentUserChecker(action: Action): Promise<User|undefined> {
		if (action.request.headers.authorization) {
			return decodeJWT(action.request.headers.authorization.replace(/^Bearer\s/, '').trim())
		} else {
			return undefined
		}
	}

	public customAuthChecker: AuthChecker<Context> = async (
		{ root, args, context, info },
		roles,
	  ) => {
		// here we can read the user from context
		// and check his permission in the db against the `roles` argument
		// that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

		return true // or false if access is denied
	  }

}

export default Authorization
