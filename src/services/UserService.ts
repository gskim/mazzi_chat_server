import { classToPlain, plainToClass } from 'class-transformer'
import { BadRequestError, NotFoundError } from 'routing-controllers'
import { Service } from 'typedi'
import { getManager, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import User from '../entities/User'
import Verification from '../entities/Verification'
import UserRepository from '../repositories/UserRepository'
import VerificationRepository from '../repositories/VerificationRepository'
import createJWT from '../utils/createJWT'
import { sendVerificationEmail } from '../utils/sendEmail'
@Service()
export default class UserService {
	@InjectRepository() private readonly userRepository: UserRepository
	@InjectRepository() private readonly verificationRepository: VerificationRepository

	public async getUserById(userId: number) {
		return await this.userRepository.findOne(userId)
	}

	public async signUp(user: User) {
		return await this.userRepository.add(user)
	}

	public async signInByEmail(email: string, password: string) {
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

	public async signUpByEmail(email: string, password: string) {
		const user = plainToClass(User, {
			email: email,
			password: password,
		})
		const createdUser = await this.userRepository.add(user)
		const verification = plainToClass(Verification, {
			userId: createdUser.id,
		})
		const createdVerification = await this.verificationRepository.save(verification)
		// email로 인증번호 전송
		// if (createdUser.email) {
		// 	const sendedEmail = await sendVerificationEmail(createdUser.email, createdVerification.key)
		// }
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
		const createdVerification = await this.verificationRepository.save(verification)
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
}
