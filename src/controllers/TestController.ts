import { Authorized, BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post, Put } from 'routing-controllers'
import { Inject } from 'typedi'
import UserService from '../services/UserService'

@JsonController('/test')
export class TestController {

	@Inject()
	public userService: UserService

	@Get('/')
	public async test() {
		await this.userService.getUserById(1)
		return {
			test: 'test',
		}
	}
}
