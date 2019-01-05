import * as Entity from 'baiji-entity'
import { Request } from 'express'
import { Authorized, BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post, Put } from 'routing-controllers'
import User, { Gender } from '../entities/User'
import Verification from '../entities/Verification'
import UserRepresentor, { UserDefault } from '../representors/UserRepresentor'
import UserService from '../services/UserService'
import { sendVerificationEmail } from '../utils/sendEmail'

@JsonController('/users')
export class UserController {

	constructor(protected userService: UserService) {}

	@Authorized()
	@Put('/')
	public async updateInfo(
		@CurrentUser() currentUser: User,
		@BodyParam('nickname') nickname: string,
		@BodyParam('birthYear') birthYear: number,
		@BodyParam('birthMonth') birthMonth: number,
		@BodyParam('birthDay') birthDay: number,
		@BodyParam('gender') gender: Gender,
	) {
		const user = await User.findOne(currentUser.id)
		if (user) {
			user.nickname = nickname
			user.birthYear = birthYear
			user.birthMonth = birthMonth
			user.birthDay = birthDay
			user.gender = gender
			await user.save()
			return {
				success: true,
			}
		}
		throw new NotFoundError('not found user')
	}

	@Get('/verification/:key')
	public async emailVerification(
		@Param('key') key: string,
	) {
		const verification = await Verification.findOne({
			where: {
				key: key,
			},
		})
		if (verification) {
			if (verification.verified) {
				return true
			} else {
				verification.verified = true
				await await verification.save()
				return true
			}
		}
		throw new NotFoundError('not found verification')
	}

	@Post('/sns')
	public async snsSignUp(
		@BodyParam('snsId') snsId: number,
		@BodyParam('snsType') snsType: string,
	) {
		return {
			token: await this.userService.signUpBySns(snsId, snsType),
		}
	}

	@Post('/email')
	public async emailSignUp(
		@BodyParam('email') email: string,
		@BodyParam('password') password: string,
	) {
		return {
			token: await this.userService.signUpByEmail(email, password),
		}
	}

	@Put('/sns')
	public async snsSignIn(
		@BodyParam('snsId') snsId: number,
		@BodyParam('snsType') snsType: string,
	) {
		return {
			token: await this.userService.signInBySns(snsId, snsType),
		}
	}

	@Put('/email')
	public async emailSignIn(
		@BodyParam('email') email: string,
		@BodyParam('password') password: string,
	) {
		return {
			token: await this.userService.signInByEmail(email, password),
		}
	}

	@Get('/:id')
	public async getUserByJWT(@Param('id') id: number, @CurrentUser() currentUser: User): Promise<UserDefault> {
		if (currentUser) {
			id = currentUser.id
		}
		const user = await User.findOne(id)
		const userDefaultEntity = new Entity(UserRepresentor.userDefault)
		return userDefaultEntity.parse(user)
	}

}
