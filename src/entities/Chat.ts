import * as passwordHash from 'password-hash'
import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	BeforeInsert,
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

export enum ChatType {
	PUBLIC = 'public',
	PRIVATE = 'private',
	RANDOM = 'random',
	CLOSE = 'close',
}
@Entity()
@ObjectType()
class Chat extends BaseEntity {
	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Column({ nullable: true })
	public name?: string

	@Column({ nullable: true })
	public description?: string

	@Column({ default: 2 })
	public maxPersons: number

	@Column({ nullable: true })
	public password?: string

	@Column({ type: 'enum', enum: ChatType, default: ChatType.RANDOM })
	public type: ChatType

	@Field((type) => [User])
	@ManyToMany((type) => User, (user) => user.chats)
	@JoinTable()
	public users: User[]

	@Field((type) => [Message])
	@OneToMany((type) => Message, (message) => message.id)
	public messages: Message[]

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date

	public comparePassword(password: string): boolean {
		if (this.password) {
			return passwordHash.verify(password, this.password)
		}
		return false
	}

	@BeforeInsert()
	public savePassword(): void {
		if (this.password && this.type === ChatType.PRIVATE) {
			const hashedPassword = this.hashPassword(this.password)
			this.password = hashedPassword
		}
	}

	private hashPassword(password: string): string {
		return passwordHash.generate(password)
	}
}
export default Chat
