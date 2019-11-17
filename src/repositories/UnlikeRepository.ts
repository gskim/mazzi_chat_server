import { EntityRepository, Repository } from 'typeorm'
import Unlike from '../entities/Unlike'
@EntityRepository(Unlike)
export default class UnlikeRepository extends Repository<Unlike> {

}
