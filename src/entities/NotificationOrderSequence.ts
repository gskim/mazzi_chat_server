import {
	BaseEntity,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
class NotificationOrderSequence extends BaseEntity {
	@PrimaryGeneratedColumn() public id: number
}
export default NotificationOrderSequence
