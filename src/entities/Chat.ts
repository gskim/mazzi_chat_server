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

	@OneToMany((type) => Message, (message) => message.chat, { nullable: true })
	public messages: Message[]

	@Field((type) => User)
	@ManyToOne((type) => User)
	public toUser: User
	@Column({ nullable: true })
	public toUserId: number

	@Field((type) => User)
	@ManyToOne((type) => User)
	public fromUser: User
	@Column({ nullable: true })
	public fromUserId: number

	@CreateDateColumn() public createdAt: string

	@UpdateDateColumn() public updatedAt: string
}
export default Chat
