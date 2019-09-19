import { Authorized, BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post, Put } from 'routing-controllers'

@JsonController('/test')
export class TestController {
	@Get('/')
	public test() {
		return {
			test: 'test',
		}
	}
}
