// import * as bcrypt from 'bcrypt'
import { IsEmail } from 'class-validator'
import * as passwordHash from 'password-hash'
import { Field, ID, ObjectType } from 'type-graphql'
import {
	BaseEntity,
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import Chat from './Chat'

const BCRYPT_ROUNDS = 10
@ObjectType()
@Entity()
class User extends BaseEntity {
	@Field((type) => ID)
	@PrimaryGeneratedColumn() public id: number

	@Field()
	@Column({ type: 'varchar', length: 30, nullable: true })
	public nickname: string

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

	@Column({ type: 'varchar', length: 12, nullable: true })
	public phone?: string

	@Field()
	@Column({ type: 'boolean', default: false })
	public verifiedPhone: boolean

	@Field({ nullable: true })
	@Column({ type: 'text', nullable: true })
	public profilePhoto?: string

	@Field()
	@Column({ type: 'double precision', default: 0 })
	public lon: number

	@Field()
	@Column({ type: 'double precision', default: 0 })
	public lat: number

	@Column({ type: 'text', nullable: true })
	public fbId?: string

	@Column({ type: 'text', nullable: true })
	public kakaoId?: string

	@Column({ type: 'text', nullable: true })
	public googleId?: string

	@Field((type) => [Chat])
	@OneToMany((type) => Chat, (chat) => chat.id)
	public chats: Chat[]

	@Field((type) => User)
	@ManyToOne((type) => User)
	public following: User

	@Field((type) => User)
	@OneToMany((type) => User, (user) => user.id)
	public follower: User

	@Field()
	@CreateDateColumn()
	public createdAt: Date

	@Field()
	@UpdateDateColumn()
	public updatedAt: Date

	public comparePassword(password: string): boolean {
		if (this.password) {
			return passwordHash.verify(password, this.password)
		}
		return false
	}

	@BeforeInsert()
	@BeforeUpdate()
	public savePassword(): void {
		if (this.password) {
			const hashedPassword = this.hashPassword(this.password)
			this.password = hashedPassword
		}
	}

	private hashPassword(password: string): string {
		return passwordHash.generate(password)
	}
}

export default User
