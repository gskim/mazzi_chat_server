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
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	RelationCount,
	UpdateDateColumn,
} from 'typeorm'
import Chat from './Chat'
import Device from './Device'
import Like from './Like'
import Post from './Post'
import Unlike from './Unlike'

export enum Gender {
	Man = 'm',
	Woman = 'w',
}

registerEnumType(Gender, { name: 'Gender' })

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
	public verified: boolean

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
	@Column({ type: 'float', default: 0, precision: 12 })
	public lat: number

	@Field()
	@Column({ type: 'float', default: 0, precision: 12 })
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
	@ManyToMany((type) => Chat, (chat) => chat.users)
	public chats: Chat[]

	@ManyToMany((type) => User, (user) => user.following, { cascade: ['insert', 'update'] })
	@JoinTable()
	public followers: User[]

	@ManyToMany((type) => User, (user) => user.followers, { cascade: ['insert', 'update'] })
	public following: User[]

	@Field((type) => Like)
	@OneToMany((type) => Like, (like) => like.user)
	public likes: Like[]

	@Field((type) => Unlike)
	@OneToMany((type) => Unlike, (unlike) => unlike.user)
	public unlikes: Unlike[]

	@Field((type) => [Post!]!)
	@OneToMany((type) => Post, (post) => post.user)
	public posts: Post[]

	@OneToMany((type) => Device, (device) => device.user)
	public devices: Device[]

	public comparePassword(password: string): boolean {
		if (this.password) {
			return passwordHash.verify(password, this.password)
		}
		return false
	}

	@BeforeInsert()
	// @BeforeUpdate()
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
