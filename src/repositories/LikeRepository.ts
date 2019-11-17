import { EntityRepository, Repository } from 'typeorm'
import Like from '../entities/Like'
@EntityRepository(Like)
export default class LikeRepository extends Repository<Like> {

}
