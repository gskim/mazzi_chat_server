import * as bcrypt from 'bcrypt'
import { IsEmail } from 'class-validator'
// import * as passwordHash from 'password-hash'
import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import Chat from './Chat'
import Message from './Message'

const BCRYPT_ROUNDS = 10
@ObjectType()
@Entity()
class User extends BaseEntity {
	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Field({ nullable: true })
	@Column({ type: 'text', nullable: true })
	@IsEmail()
	public email?: string

	@Field()
	@Column({ type: 'boolean', default: false })
	public verifiedEmail: boolean

	@Field()
	@Column({ type: 'int', nullable: false })
	public birthYear: number

	@Field()
	@Column({ type: 'int', nullable: false })
	public birthMonth: number

	@Field()
	@Column({ type: 'int', nullable: false })
	public birthDay: number

	@Field({ nullable: true })
	@Column({ type: 'text', nullable: true })
	public password?: string

	@Column({ type: 'text', nullable: true })
	public phoneNumber?: string

	@Field()
	@Column({ type: 'boolean', default: false })
	public verifiedPhoneNumber: boolean

	@Field({ nullable: true })
	@Column({ type: 'text', nullable: true })
	public profilePhoto?: string

	@Field()
	@Column({ type: 'double precision', default: 0 })
	public lastLng: number

	@Field()
	@Column({ type: 'double precision', default: 0 })
	public lastLat: number

	@Column({ type: 'text', nullable: true })
	public fbId?: string

	@Field((type) => [Chat])
	@OneToMany((type) => Chat, (chat) => chat.fromUser || chat.toUser)
	public chats: Chat[]

	@Field((type) => [Message])
	@OneToMany((type) => Message, (message) => message.user)
	public messages: Message[]

	@Field()
	@CreateDateColumn()
	public createdAt: string

	@Field()
	@UpdateDateColumn()
	public updatedAt: string

	public async comparePassword(password: string): Promise<boolean> {
		if (this.password) {
			return await bcrypt.compare(password, this.password)
		}
		return false
	}

	@BeforeInsert()
	@BeforeUpdate()
	public async savePassword(): Promise<void> {
		if (this.password) {
			const hashedPassword = await this.hashPassword(this.password)
			this.password = hashedPassword
		}
	}

	private async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, BCRYPT_ROUNDS)
	}
}

export default User
