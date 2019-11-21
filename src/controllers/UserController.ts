import * as Entity from 'baiji-entity'
import { Authorized, BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post, Put } from 'routing-controllers'
import { Inject } from 'typedi'
import User, { Gender } from '../entities/User'
import Verification from '../entities/Verification'
import UserRepresentor, { UserDefault } from '../representors/UserRepresentor'
import UserService from '../services/UserService'
import VerificationService from '../services/VerificationService'

@JsonController('/users')
export class UserController {

	@Inject()
	private readonly userService: UserService
	@Inject()
	private readonly verificationService: VerificationService

	// email 회원가입
	@Post('/email')
	public async emailSignUp(
		@BodyParam('email') email: string,
		@BodyParam('password') password: string,
		@BodyParam('uuid') uuid: string,
		@BodyParam('nickname') nickname: string,
		@BodyParam('gender') gender: Gender,
	) {
		return {
			success: await this.userService.signUpByEmail(email, password, nickname, gender),
		}
	}

	// 이메일 로그인
	@Put('/email')
	public async emailSignIn(
		@BodyParam('email') email: string,
		@BodyParam('password') password: string,
	) {
		return {
			token: await this.userService.signInByEmail(email, password),
		}
	}

	// 전화번호 회원가입
	@Post('/phone')
	public async phoneSignUp(
		@BodyParam('phone') phone: string,
		@BodyParam('password') password: string,
	) {
		return {
			token: await this.userService.signUpByPhone(phone, password),
		}
	}

	// 전화번호 로그인
	@Put('/phone')
	public async phoneSignIn(
		@BodyParam('phone') phone: string,
		@BodyParam('password') password: string,
	) {
		return {
			token: await this.userService.signInByPhone(phone, password),
		}
	}

	// 로그아웃
	@Authorized()
	@Put('/logout')
	public async logout(
		@CurrentUser() currentUser: User,
	) {
		//  device logout 처리
	}

	// 개인정보 수정
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
		if (currentUser) {
			currentUser.nickname = nickname
			currentUser.birthYear = birthYear
			currentUser.birthMonth = birthMonth
			currentUser.birthDay = birthDay
			currentUser.gender = gender
			await currentUser.save()
			return {
				success: true,
			}
		}
		throw new NotFoundError('not found user')
	}

	// 인증번호 요청
	@Post('/verification')
	public async verificationRequest(
		@CurrentUser() user: User,
	) {
		// email or phone 인증번호 발송
	}

	@Get('/verification/:key')
	public async emailVerification(
		@Param('key') key: string,
	) {
		await this.verificationService.confirmVerification(key)
		return '승인되었습니다.'
	}

	// 인증번호 확인
	@Put('/verification')
	public async phoneVerification(
		@BodyParam('key') key: string,
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
				await verification.save()
				return true
			}
		}
		throw new NotFoundError('not found verification')
	}

	// sns 회원가입
	@Post('/sns')
	public async snsSignUp(
		@BodyParam('snsId') snsId: number,
		@BodyParam('snsType') snsType: string,
	) {
		return {
			token: await this.userService.signUpBySns(snsId, snsType),
		}
	}

	// sns 로그인
	@Put('/sns')
	public async snsSignIn(
		@BodyParam('snsId') snsId: number,
		@BodyParam('snsType') snsType: string,
	) {
		return {
			token: await this.userService.signInBySns(snsId, snsType),
		}
	}

	// 내 팔뤄리스트
	@Get('/followers')
	public async followersss(@CurrentUser() currentUser: User): Promise<User[]> {
		return this.userService.myFollowers(currentUser)
	}

	@Get('/simple')
	public async getUserByJWT(@CurrentUser() currentUser: User): Promise<UserDefault> {
		const userDefaultEntity = new Entity(UserRepresentor.userDefault)
		return userDefaultEntity.parse(currentUser)
	}

	@Post('/follow')
	public async follow(@BodyParam('userId') userId: number, @CurrentUser() currentUser: User) {
		await this.userService.addFollower(currentUser, userId)
		return true
	}
	@Post('/unfollow')
	public async unfollow(@BodyParam('userId') userId: number, @CurrentUser() currentUser: User) {
		await this.userService.removeFollower(currentUser, userId)
		return true
	}

}
