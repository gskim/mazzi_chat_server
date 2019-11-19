import { EntityRepository, Repository } from 'typeorm'
import PostOrderSequence from '../entities/PostOrderSequence'
@EntityRepository(PostOrderSequence)
export default class PostOrderSequenceRepository extends Repository<PostOrderSequence> {

}
