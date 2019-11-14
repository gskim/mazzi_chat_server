import * as Entity from 'baiji-entity'
import { Authorized, BodyParam, CurrentUser, Get, JsonController, NotFoundError, Param, Post, Put } from 'routing-controllers'
import { Service } from 'typedi'
import { InjectRepository } from 'typeorm-typedi-extensions'
import User, { Gender } from '../entities/User'
import Verification from '../entities/Verification'
import UserRepository from '../repositories/UserRepository'
import UserRepresentor, { UserDefault } from '../representors/UserRepresentor'
import UserService from '../services/UserService'

@JsonController('/users')
export class UserController {

	@Service()
	private readonly userService: UserService
	@InjectRepository()
	private readonly userRepository: UserRepository

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

	// 인증번호 확인
	@Put('/verification')
	public async emailVerification(
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
		return await this.userRepository.createQueryBuilder()
			.relation('followers')
			.of(currentUser)
			.loadMany()
	}

	@Get('/simple')
	public async getUserByJWT(@CurrentUser() currentUser: User): Promise<UserDefault> {
		const userDefaultEntity = new Entity(UserRepresentor.userDefault)
		return userDefaultEntity.parse(currentUser)
	}

	@Post('/follow')
	public async follow(@BodyParam('userId') userId: number, @CurrentUser() currentUser: User) {
		await this.userRepository.createQueryBuilder()
			.relation(User, 'followers')
			.of(currentUser.id)
			.add(userId)
		return true
	}
	@Post('/unfollow')
	public async unfollow(@BodyParam('userId') userId: number, @CurrentUser() currentUser: User) {
		await this.userRepository.createQueryBuilder()
			.relation(User, 'followers')
			.of(currentUser.id)
			.remove(userId)
		return true
	}

}
