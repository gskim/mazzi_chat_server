import { EntityRepository, getManager, Repository } from 'typeorm'
import Verification from '../entities/Verification'
@EntityRepository(Verification)
export default class VerificationRepository extends Repository<Verification> {

}
