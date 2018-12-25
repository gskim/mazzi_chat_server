import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import Chat from './Chat'
import User from './User'

@ObjectType()
@Entity()
class Message extends BaseEntity {
	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Column({ type: 'text' })
	public text: string

	@Column({ nullable: true })
	public chatId: number

	@Column({ type: 'boolean', default: false })
	public isRead: boolean

	@Column({ type: 'boolean', default: false })
	public sendSuccess: boolean

	@ManyToOne((type) => Chat, (chat) => chat.messages)
	public chat: Chat

	@ManyToOne((type) => User, (user) => user.messages)
	public user: User

	@CreateDateColumn() public createdAt: string

	@UpdateDateColumn() public updatedAt: string
}
export default Message
