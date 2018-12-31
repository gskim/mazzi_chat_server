import { Request } from 'express'
import { CurrentUser, Get, JsonController, Req, Res } from 'routing-controllers'
import User from '../entities/User'

@JsonController('/users')
export class UserController {

	// @Get('/')
	// public async users(
	// 	@Req() req: any, @Res() res: any) {
	// 	return res.json(await User.find())
	// }

}
