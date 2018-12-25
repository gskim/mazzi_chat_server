import * as jwt from 'jsonwebtoken'
import { Action } from 'routing-controllers'
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

}

export default Authorization
