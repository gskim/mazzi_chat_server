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
export default class VerificationService {

	@InjectRepository() private verificationRepository: VerificationRepository
	@InjectRepository() private userRepository: UserRepository

	public async confirmVerification(key: string) {
		const verification = await this.verificationRepository.findOne({
			relations: ['user'],
			where: {
				key: key,
				verified: false,
			},
		})
		if (verification) {
			verification.verified = true
			await verification.save()
			const user = await this.userRepository.findOne(verification.user.id)
			if (user) {
				user.verified = true
				await user.save()
			}
		}
		return true
	}
}
