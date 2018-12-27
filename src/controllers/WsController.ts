import { Request } from 'express'
import { CurrentUser, Get, JsonController, Post, Req, Res } from 'routing-controllers'
import User from '../entities/User'

@JsonController()
export class WsController {

	@Get('/@Connections')
	public async get(
		@Req() req: any, @Res() res: any) {
			console.log('------------get------------')
			console.log(req)
			console.log(res)
		 return res.json({
			a: 'b',
		})
	}
	@Post('/@Connections')
	public async post(
		@Req() req: any, @Res() res: any) {
			console.log('---------post---------------')
			console.log(req)
			console.log(res)
		 return res.json({
			a: 'b',
		})
	}

}
