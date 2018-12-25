import {
	BaseEntity,
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

export enum VerificationTarget {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL',
}
@Entity()
class Verification extends BaseEntity {
	@PrimaryGeneratedColumn() public id: number

	@Column({ type: 'text', enum: VerificationTarget })
	public target: VerificationTarget

	@Column({ type: 'text' })
	public payload: string

	@Column({ type: 'text' })
	public key: string

	@Column({ type: 'boolean', default: false })
	public verified: boolean

	@CreateDateColumn() public createdAt: string

	@UpdateDateColumn() public updatedAt: string

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
