import { classToPlain, plainToClass } from 'class-transformer'
import { NotFoundError } from 'routing-controllers'
import { Service } from 'typedi'
import { getManager, Repository } from 'typeorm'
import { InjectRepository } from 'typeorm-typedi-extensions'
import User from '../entities/User'
import Verification from '../entities/Verification'
import UserRepository from '../repositories/UserRepository'
import createJWT from '../utils/createJWT'
import { sendVerificationEmail } from '../utils/sendEmail'
@Service()
export default class UserService {
	constructor(@InjectRepository(User) private readonly userRepository: UserRepository) {}

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
		if (createdUser) {
			const verification = plainToClass(Verification, {
				userId: user.id,
			})
			const createdVerification = await Verification.save(verification)
			if (createdUser.email) {
				const sendedEmail = await sendVerificationEmail(createdUser.email, createdVerification.key)
			}
			return createJWT(user.id)
		}
		throw new NotFoundError('not found user')
	}
}
