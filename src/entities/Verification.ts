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

export enum VerificationTarget {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL',
}
@Entity()
class Verification extends BaseEntity {
	@PrimaryGeneratedColumn() public id: number

	@Column({ type: 'text', enum: VerificationTarget })
	public target: VerificationTarget

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
		if (this.target === VerificationTarget.PHONE) {
			this.key = Math.floor(Math.random() * 100000).toString()
		} else if (this.target === VerificationTarget.EMAIL) {
			this.key = Math.random()
				.toString(36)
				.substr(2)
		}
	}
}
export default Verification
