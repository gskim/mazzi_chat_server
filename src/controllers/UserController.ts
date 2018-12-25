import { Request } from 'express'
import { CurrentUser, Get, JsonController, Req, Res } from 'routing-controllers'
import User from '../entities/User'

@JsonController()
export class UserController {

	@Get('/test')
	public async test(
		@Req() req: any, @Res() res: any) {
		console.log(req.headers)
		return req.headers

	}

}
