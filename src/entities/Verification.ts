import {
	BaseEntity,
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import User from './User'

@Entity()
class Verification extends BaseEntity {
	@PrimaryGeneratedColumn() public id: number

	@OneToOne((type) => User)
	@JoinColumn()
	public user: User

	@Column({ type: 'text' })
	public key: string

	@Column({ type: 'boolean', default: false })
	public verified: boolean

	@CreateDateColumn() public createdAt: Date

	@UpdateDateColumn() public updatedAt: Date

	@BeforeInsert()
	public createKey(): void {
		this.key = Math.random()
				.toString(36)
				.substr(2)
	}
}
export default Verification
