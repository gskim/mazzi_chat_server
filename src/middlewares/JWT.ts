import { NextFunction, Request, Response } from 'express'
import decodeJWT from '../utils/decodeJWT'
const jwt = async (
	req: any,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.replace(/^Bearer\s/, '').trim()
		const user = await decodeJWT(token)
		if (user) {
			req.user = user
		} else {
			req.user = undefined
		}
	} else {
		req.user = undefined
	}
	next()
}
export default jwt
