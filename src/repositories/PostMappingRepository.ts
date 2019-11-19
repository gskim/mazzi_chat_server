import { EntityRepository, Repository } from 'typeorm'
import PostMapping from '../entities/PostMapping'
@EntityRepository(PostMapping)
export default class PostMappingRepository extends Repository<PostMapping> {

}
