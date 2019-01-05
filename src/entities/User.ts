// import * as bcrypt from 'bcrypt'
import { IsEmail } from 'class-validator'
import * as passwordHash from 'password-hash'
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql'
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

export enum Gender {
	Man = 'm',
	Woman = 'w',
}

registerEnumType(Gender, {
	name: 'Gender',
})

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
	@Column({ type: 'enum', enum: Gender, nullable: true })
	public gender?: Gender

	@Field()
	@Column({ type: 'int', nullable: true })
	public birthYear?: number

	@Field()
	@Column({ type: 'int', nullable: true })
	public birthMonth?: number

	@Field()
	@Column({ type: 'int', nullable: true })
	public birthDay?: number

	@Field({ nullable: true })
	@Column({ type: 'text', nullable: true })
	public password?: string

	@Field({ nullable: true })
	@Column({ type: 'text', nullable: true })
	public profilePhoto?: string

	@Field()
	@Column({ type: 'double precision', default: 0 })
	public lat: number

	@Field()
	@Column({ type: 'double precision', default: 0 })
	public lon: number

	@Column({ type: 'int', nullable: true })
	public snsId?: number

	@Column({ type: 'varchar', length: 10, nullable: true })
	public snsType?: string

	@Column({ type: 'int', default: 0 })
	public point: number

	@Field()
	@CreateDateColumn()
	public createdAt: Date

	@Field()
	@UpdateDateColumn()
	public updatedAt: Date

	@Field((type) => [Chat])
	@OneToMany((type) => Chat, (chat) => chat.id)
	public chats: Chat[]

	@Field((type) => User)
	@ManyToOne((type) => User)
	public following: User

	@Field((type) => User)
	@OneToMany((type) => User, (user) => user.id)
	public follower: User

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
