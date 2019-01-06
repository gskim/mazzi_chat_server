import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Generated,
	JoinColumn,
	JoinTable,
	ManyToMany,
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

	@Column({ nullable: true })
	public name?: string

	@Column({ default: 2 })
	public maxPersons: number

	@Field((type) => [User])
	@ManyToMany((type) => User, (user) => user.chats)
	@JoinTable()
	public users: User[]

	@Field((type) => [Message])
	@OneToMany((type) => Message, (message) => message.id)
	public messages: Message[]

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date
}
export default Chat
