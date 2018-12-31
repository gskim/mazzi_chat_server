import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
class MessageOrderSequence extends BaseEntity {
	@PrimaryGeneratedColumn() public id: number
}
export default MessageOrderSequence
