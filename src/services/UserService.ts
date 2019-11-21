import { classToPlain, plainToClass } from 'class-transformer'
import { BadRequestError, NotFoundError } from 'routing-controllers'
import { Service } from 'typedi'
import { getManager, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import User, { Gender } from '../entities/User'
import Verification from '../entities/Verification'
import UserRepository from '../repositories/UserRepository'
import VerificationRepository from '../repositories/VerificationRepository'
import createJWT from '../utils/createJWT'
import { sendVerificationEmail } from '../utils/sendEmail'
@Service()
export default class UserService {

	@InjectRepository(User) private userRepository: UserRepository
	@InjectRepository(Verification) private verificationRepository: VerificationRepository

	public async signInByEmail(email: string, password: string) {
		try {
			const user = await this.userRepository.findOne({
				where: {
					email: email,
				},
			})
			if (user) {
				if (user.comparePassword(password)) {
					return createJWT(user.id)
				} else {
					throw new BadRequestError('incorrect password')
				}
			}
			throw new NotFoundError('not found user')
		} catch (error) {
			throw new Error('')
		}
	}

	public async signInBySns(snsId: number, snsType: string) {
		const user = await this.userRepository.findOne({
			where: {
				snsId: snsId,
				snsType: snsType,
			},
		})
		if (user) {
			return createJWT(user.id)
		}
		throw new NotFoundError('not found user')
	}

	public async signUpBySns(snsId: number, snsType: string) {
		const user = plainToClass(User, {
			snsId: snsId,
			snsType: snsType,
		})
		const createdUser = await this.userRepository.add(user)
		if (createdUser) {
			return createJWT(user.id)
		}
		throw new NotFoundError('not found user')
	}

	public async signUpByEmail(email: string, password: string, nickname: string, gender: Gender) {
		const user = plainToClass(User, {
			email: email,
			password: password,
			nickname: nickname,
			gender: gender,
		})
		const createdUser = await this.userRepository.add(user)
		const verification = plainToClass(Verification, {
			user: createdUser,
		})
		const createdVerification = await this.verificationRepository.save(verification)
		if (createdUser.email) {
			const sendedEmail = await sendVerificationEmail(createdUser.email, createdVerification.key)
		}
		return createJWT(createdUser.id)
	}

	public async signUpByPhone(phone: string, password: string) {
		const user = plainToClass(User, {
			phone: phone, password: password,
		})
		const createdUser = await this.userRepository.add(user)
		const verification = plainToClass(Verification, {
			userId: createdUser.id,
		})
		// const createdVerification = await this.verificationRepository.save(verification)
		// 문자로 인증번호 전송
		return createJWT(createdUser.id)
	}

	public async signInByPhone(phone: string, password: string) {
		const user = await this.userRepository.findOne({
			where: {
				phone: phone,
			},
		})
		if (user) {
			if (user.comparePassword(password)) {
				return createJWT(user.id)
			} else {
				throw new BadRequestError('incorrect password')
			}
		}
		throw new NotFoundError('not found user')
	}
	public async addFollower(user: User, followerId: number) {
		return await this.userRepository.createQueryBuilder()
			.relation(User, 'followers')
			.of(user.id)
			.add(followerId)
	}

	public async removeFollower(user: User, unfollowerId: number) {
		return await this.userRepository.createQueryBuilder()
			.relation(User, 'followers')
			.of(user.id)
			.remove(unfollowerId)
	}

	public async myFollowers(user: User) {
		return await this.userRepository.createQueryBuilder()
			.relation('followers')
			.of(user)
			.loadMany()
	}

	public async userProfile(id: number) {
		const user = await this.userRepository.createQueryBuilder('user')
		.where(`user.id = :id`)
		.setParameter('id', id)
		.getOne()
		return user
	}
}
