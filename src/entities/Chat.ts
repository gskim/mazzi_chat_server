import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import Message from './Message'
import User from './User'

@Entity()
@ObjectType()
class Chat extends BaseEntity {
	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Field((type) => Number)
	@ManyToOne((type) => User)
	public fromUserId: User

	@Field((type) => Number)
	@ManyToOne((type) => User)
	public toUserId: User

	@Field((type) => [Message])
	@OneToMany((type) => Message, (message) => message.id)
	public messages: Message[]

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date
}
export default Chat
