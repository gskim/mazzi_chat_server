import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
class PostOrderSequence extends BaseEntity {
	@PrimaryGeneratedColumn() public id: number
}
export default PostOrderSequence
